from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.template import Template, TemplateSection
from app.models.user import User
from app.schemas.template import TemplateCreate, TemplateOut, TemplateUpdate

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("", response_model=list[TemplateOut])
def list_templates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[TemplateOut]:
    templates = db.scalars(
        select(Template)
        .where(Template.business_id == current_user.business_id, Template.deleted_at.is_(None))
        .order_by(Template.updated_at.desc())
    ).all()
    return [TemplateOut.model_validate(t) for t in templates]


@router.post("", response_model=TemplateOut, status_code=status.HTTP_201_CREATED)
def create_template(
    payload: TemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TemplateOut:
    template = Template(
        business_id=current_user.business_id,
        name=payload.name,
        description=payload.description,
        default_terms=payload.default_terms,
        default_validity_days=payload.default_validity_days,
        pricing_table=payload.pricing_table,
    )
    db.add(template)
    db.flush()

    for i, section_data in enumerate(payload.sections):
        section = TemplateSection(
            template_id=template.id,
            title=section_data.title,
            content=section_data.content,
            order=section_data.order or i,
            section_type=section_data.section_type,
        )
        db.add(section)

    db.commit()
    db.refresh(template)
    return TemplateOut.model_validate(template)


@router.get("/{template_id}", response_model=TemplateOut)
def get_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TemplateOut:
    template = db.scalar(
        select(Template).where(
            Template.id == template_id,
            Template.business_id == current_user.business_id,
            Template.deleted_at.is_(None),
        )
    )
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return TemplateOut.model_validate(template)


@router.patch("/{template_id}", response_model=TemplateOut)
def update_template(
    template_id: int,
    payload: TemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TemplateOut:
    template = db.scalar(
        select(Template).where(
            Template.id == template_id,
            Template.business_id == current_user.business_id,
            Template.deleted_at.is_(None),
        )
    )
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")

    for field, value in payload.model_dump(exclude_unset=True, exclude={"sections"}).items():
        setattr(template, field, value)

    if payload.sections is not None:
        for section in template.sections:
            db.delete(section)
        for i, section_data in enumerate(payload.sections):
            section = TemplateSection(
                template_id=template.id,
                title=section_data.title,
                content=section_data.content,
                order=section_data.order or i,
                section_type=section_data.section_type,
            )
            db.add(section)

    db.commit()
    db.refresh(template)
    return TemplateOut.model_validate(template)


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    template = db.scalar(
        select(Template).where(
            Template.id == template_id,
            Template.business_id == current_user.business_id,
            Template.deleted_at.is_(None),
        )
    )
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    template.soft_delete()
    db.commit()
