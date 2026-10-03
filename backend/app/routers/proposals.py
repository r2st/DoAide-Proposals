from __future__ import annotations

import secrets
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.client import Client
from app.models.proposal import Proposal, ProposalSection, ProposalStatus
from app.models.proposal_view import ProposalView
from app.models.signature import Signature
from app.models.template import Template
from app.models.usage import UsageTracking
from app.models.user import User
from app.schemas.proposal import (
    GenerateRequest,
    ProposalCreate,
    ProposalListOut,
    ProposalOut,
    ProposalUpdate,
    PublicProposalOut,
    SignatureRequest,
)
from app.services.ai_generator import generate_proposal_content
from app.services.pdf_generator import generate_pdf
from app.services.pricing import calculate_totals

router = APIRouter(prefix="/proposals", tags=["proposals"])


def _check_usage_limit(db: Session, business_id: int) -> None:
    month = datetime.now(UTC).strftime("%Y-%m")
    usage = db.scalar(
        select(UsageTracking).where(
            UsageTracking.business_id == business_id, UsageTracking.month == month
        )
    )
    count = usage.proposals_created if usage else 0
    limit = settings.free_tier_monthly_limit
    if limit > 0 and count >= limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Monthly proposal limit reached ({limit}). Upgrade to Pro for unlimited.",
        )


def _track_usage(db: Session, business_id: int) -> None:
    month = datetime.now(UTC).strftime("%Y-%m")
    usage = db.scalar(
        select(UsageTracking).where(
            UsageTracking.business_id == business_id, UsageTracking.month == month
        )
    )
    if usage:
        usage.proposals_created += 1
    else:
        db.add(UsageTracking(business_id=business_id, month=month, proposals_created=1))


@router.get("", response_model=list[ProposalListOut])
def list_proposals(
    status_filter: ProposalStatus | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ProposalListOut]:
    query = select(Proposal).where(
        Proposal.business_id == current_user.business_id, Proposal.deleted_at.is_(None)
    )
    if status_filter:
        query = query.where(Proposal.status == status_filter)
    query = query.order_by(Proposal.updated_at.desc())
    proposals = db.scalars(query).all()
    return [ProposalListOut.model_validate(p) for p in proposals]


@router.post("", response_model=ProposalOut, status_code=status.HTTP_201_CREATED)
def create_proposal(
    payload: ProposalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProposalOut:
    _check_usage_limit(db, current_user.business_id)

    totals = calculate_totals(
        [item.model_dump() for item in payload.pricing_items] if payload.pricing_items else None,
        payload.discount_percent,
        payload.tax_percent,
    )

    proposal = Proposal(
        business_id=current_user.business_id,
        title=payload.title,
        client_id=payload.client_id,
        template_id=payload.template_id,
        client_name=payload.client_name,
        client_email=payload.client_email,
        client_company=payload.client_company,
        subtotal=totals["subtotal"],
        discount_percent=payload.discount_percent,
        tax_percent=payload.tax_percent,
        total=totals["total"],
        terms=payload.terms,
        notes=payload.notes,
        validity_days=payload.validity_days,
        pricing_items=totals["items"] if totals["items"] else None,
        view_token=secrets.token_urlsafe(32),
    )
    db.add(proposal)
    db.flush()

    for i, section_data in enumerate(payload.sections):
        section = ProposalSection(
            proposal_id=proposal.id,
            title=section_data.title,
            content=section_data.content,
            order=section_data.order or i,
            section_type=section_data.section_type,
        )
        db.add(section)

    _track_usage(db, current_user.business_id)
    db.commit()
    db.refresh(proposal)
    return ProposalOut.model_validate(proposal)


@router.get("/stats")
def proposal_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    base = select(Proposal).where(
        Proposal.business_id == current_user.business_id, Proposal.deleted_at.is_(None)
    )
    total = db.scalar(select(func.count()).select_from(base.subquery()))
    sent = db.scalar(
        select(func.count()).select_from(
            base.where(Proposal.status != ProposalStatus.DRAFT).subquery()
        )
    )
    accepted = db.scalar(
        select(func.count()).select_from(
            base.where(Proposal.status == ProposalStatus.ACCEPTED).subquery()
        )
    )
    rejected = db.scalar(
        select(func.count()).select_from(
            base.where(Proposal.status == ProposalStatus.REJECTED).subquery()
        )
    )

    month = datetime.now(UTC).strftime("%Y-%m")
    usage = db.scalar(
        select(UsageTracking).where(
            UsageTracking.business_id == current_user.business_id,
            UsageTracking.month == month,
        )
    )

    return {
        "total": total or 0,
        "sent": sent or 0,
        "accepted": accepted or 0,
        "rejected": rejected or 0,
        "conversion_rate": round(accepted / sent * 100, 1) if sent else 0,
        "monthly_usage": usage.proposals_created if usage else 0,
        "monthly_limit": settings.free_tier_monthly_limit,
    }


@router.get("/{proposal_id}", response_model=ProposalOut)
def get_proposal(
    proposal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProposalOut:
    proposal = db.scalar(
        select(Proposal).where(
            Proposal.id == proposal_id,
            Proposal.business_id == current_user.business_id,
            Proposal.deleted_at.is_(None),
        )
    )
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")
    return ProposalOut.model_validate(proposal)


@router.patch("/{proposal_id}", response_model=ProposalOut)
def update_proposal(
    proposal_id: int,
    payload: ProposalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProposalOut:
    proposal = db.scalar(
        select(Proposal).where(
            Proposal.id == proposal_id,
            Proposal.business_id == current_user.business_id,
            Proposal.deleted_at.is_(None),
        )
    )
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")

    updates = payload.model_dump(exclude_unset=True, exclude={"sections", "pricing_items"})
    for field, value in updates.items():
        setattr(proposal, field, value)

    if payload.pricing_items is not None:
        totals = calculate_totals(
            [item.model_dump() for item in payload.pricing_items],
            payload.discount_percent or proposal.discount_percent,
            payload.tax_percent or proposal.tax_percent,
        )
        proposal.subtotal = totals["subtotal"]
        proposal.total = totals["total"]
        proposal.pricing_items = totals["items"] if totals["items"] else None

    if payload.sections is not None:
        for section in proposal.sections:
            db.delete(section)
        for i, section_data in enumerate(payload.sections):
            section = ProposalSection(
                proposal_id=proposal.id,
                title=section_data.title,
                content=section_data.content,
                order=section_data.order or i,
                section_type=section_data.section_type,
            )
            db.add(section)

    db.commit()
    db.refresh(proposal)
    return ProposalOut.model_validate(proposal)


@router.post("/{proposal_id}/send", response_model=ProposalOut)
def send_proposal(
    proposal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProposalOut:
    proposal = db.scalar(
        select(Proposal).where(
            Proposal.id == proposal_id,
            Proposal.business_id == current_user.business_id,
            Proposal.deleted_at.is_(None),
        )
    )
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")

    now = datetime.now(UTC)
    proposal.status = ProposalStatus.SENT
    proposal.sent_at = now
    proposal.expires_at = now + timedelta(days=proposal.validity_days)
    if not proposal.view_token:
        proposal.view_token = secrets.token_urlsafe(32)

    db.commit()
    db.refresh(proposal)
    return ProposalOut.model_validate(proposal)


@router.delete("/{proposal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proposal(
    proposal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    proposal = db.scalar(
        select(Proposal).where(
            Proposal.id == proposal_id,
            Proposal.business_id == current_user.business_id,
            Proposal.deleted_at.is_(None),
        )
    )
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")
    proposal.soft_delete()
    db.commit()


@router.post("/generate", response_model=ProposalOut, status_code=status.HTTP_201_CREATED)
def generate_proposal(
    payload: GenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProposalOut:
    _check_usage_limit(db, current_user.business_id)

    template = db.scalar(
        select(Template).where(
            Template.id == payload.template_id,
            Template.business_id == current_user.business_id,
            Template.deleted_at.is_(None),
        )
    )
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")

    client = None
    client_name = payload.client_name
    client_company = payload.client_company
    if payload.client_id:
        client = db.scalar(
            select(Client).where(
                Client.id == payload.client_id,
                Client.business_id == current_user.business_id,
                Client.deleted_at.is_(None),
            )
        )
        if client:
            client_name = client_name or client.name
            client_company = client_company or client.company

    template_sections = [
        {"title": s.title, "content": s.content, "order": s.order, "section_type": s.section_type}
        for s in template.sections
    ]

    generated = generate_proposal_content(
        template.name, template_sections, payload.brief, client_name, client_company
    )

    proposal = Proposal(
        business_id=current_user.business_id,
        title=f"Proposal for {client_company or client_name or 'Client'}",
        client_id=payload.client_id,
        template_id=template.id,
        client_name=client_name,
        client_email=client.email if client else None,
        client_company=client_company,
        terms=template.default_terms,
        validity_days=template.default_validity_days,
        pricing_items=template.pricing_table.get("items") if template.pricing_table else None,
        view_token=secrets.token_urlsafe(32),
    )
    db.add(proposal)
    db.flush()

    for i, section_data in enumerate(generated):
        section = ProposalSection(
            proposal_id=proposal.id,
            title=section_data.get("title", f"Section {i + 1}"),
            content=section_data.get("content", ""),
            order=i,
            section_type="text",
        )
        db.add(section)

    _track_usage(db, current_user.business_id)
    db.commit()
    db.refresh(proposal)
    return ProposalOut.model_validate(proposal)


@router.get("/{proposal_id}/pdf")
def export_pdf(
    proposal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    proposal = db.scalar(
        select(Proposal).where(
            Proposal.id == proposal_id,
            Proposal.business_id == current_user.business_id,
            Proposal.deleted_at.is_(None),
        )
    )
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")

    business = current_user.business
    pdf_data = {
        "title": proposal.title,
        "business_name": business.name,
        "business_email": business.email,
        "business_phone": business.phone,
        "business_address": business.address,
        "client_name": proposal.client_name,
        "client_email": proposal.client_email,
        "client_company": proposal.client_company,
        "sections": [{"title": s.title, "content": s.content} for s in proposal.sections],
        "pricing_items": proposal.pricing_items or [],
        "subtotal": str(proposal.subtotal or 0),
        "discount_percent": str(proposal.discount_percent or 0),
        "discount_amount": "0",
        "tax_percent": str(proposal.tax_percent or 0),
        "tax_amount": "0",
        "total": str(proposal.total or 0),
        "terms": proposal.terms,
        "validity_days": proposal.validity_days,
    }

    pdf_bytes = generate_pdf(pdf_data)
    filename = f"proposal-{proposal.id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/view/{token}", response_model=PublicProposalOut)
def public_view(token: str, request: Request, db: Session = Depends(get_db)) -> PublicProposalOut:
    proposal = db.scalar(
        select(Proposal).where(Proposal.view_token == token, Proposal.deleted_at.is_(None))
    )
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")

    from app.models.business import Business

    business = db.get(Business, proposal.business_id)

    if proposal.status == ProposalStatus.SENT:
        proposal.status = ProposalStatus.VIEWED
        db.commit()

    view = ProposalView(
        proposal_id=proposal.id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent", "")[:500],
    )
    db.add(view)
    db.commit()

    return PublicProposalOut(
        **ProposalOut.model_validate(proposal).model_dump(
            exclude={"view_token", "template_id"}
        ),
        business_name=business.name if business else None,
        business_logo=business.logo_url if business else None,
        business_email=business.email if business else None,
        business_phone=business.phone if business else None,
        business_address=business.address if business else None,
        business_website=business.website if business else None,
    )


@router.post("/view/{token}/sign")
def sign_proposal(
    token: str,
    payload: SignatureRequest,
    request: Request,
    db: Session = Depends(get_db),
) -> dict:
    proposal = db.scalar(
        select(Proposal).where(Proposal.view_token == token, Proposal.deleted_at.is_(None))
    )
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")

    if proposal.status in (ProposalStatus.ACCEPTED, ProposalStatus.REJECTED):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Proposal has already been {proposal.status.value}",
        )

    signature = Signature(
        proposal_id=proposal.id,
        signer_name=payload.signer_name,
        signer_email=payload.signer_email,
        signature_data=payload.signature_data,
        ip_address=request.client.host if request.client else None,
        accepted=payload.accepted,
    )
    db.add(signature)

    proposal.status = ProposalStatus.ACCEPTED if payload.accepted else ProposalStatus.REJECTED
    db.commit()

    return {"status": proposal.status.value, "message": f"Proposal {proposal.status.value}"}
