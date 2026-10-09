from __future__ import annotations

from decimal import Decimal

from fastapi import APIRouter, Response
from pydantic import BaseModel, Field

from app.services.pdf_generator import generate_pdf
from app.services.pricing import calculate_totals

router = APIRouter(prefix="/public", tags=["public-tools"])


class BuilderPricingItem(BaseModel):
    description: str = Field(max_length=500)
    quantity: Decimal = Decimal("1")
    unit_price: Decimal


class BuilderSection(BaseModel):
    title: str = Field(max_length=255)
    content: str = Field(default="", max_length=5000)


class ProposalBuilderRequest(BaseModel):
    title: str = Field(max_length=500)
    business_name: str = Field(default="", max_length=255)
    business_email: str = Field(default="", max_length=255)
    client_name: str = Field(default="", max_length=255)
    client_company: str = Field(default="", max_length=255)
    client_email: str = Field(default="", max_length=255)
    sections: list[BuilderSection] = []
    pricing_items: list[BuilderPricingItem] = []
    discount_percent: Decimal = Field(default=Decimal("0"), ge=0, le=100)
    tax_percent: Decimal = Field(default=Decimal("0"), ge=0, le=100)
    terms: str = Field(default="", max_length=3000)
    validity_days: int = Field(default=30, ge=1, le=365)


SEED_TEMPLATES = [
    {
        "slug": "consulting",
        "name": "Consulting Proposal",
        "description": "Professional consulting engagement with discovery, analysis, and recommendations.",
        "sections": [
            {"title": "Executive Summary", "hint": "Summarize the engagement: client problem, your approach, and expected outcome."},
            {"title": "Situation Analysis", "hint": "Describe the client's current state, challenges, and opportunities you've identified."},
            {"title": "Approach & Methodology", "hint": "Outline your consulting framework, phases, and key activities."},
            {"title": "Deliverables", "hint": "List all tangible outputs the client will receive."},
            {"title": "Timeline & Milestones", "hint": "Break the engagement into phases with dates and checkpoints."},
            {"title": "Team & Qualifications", "hint": "Introduce key team members and relevant experience."},
            {"title": "Investment", "hint": "Detail pricing by phase or deliverable with payment terms."},
        ],
        "default_terms": "Payment: 50% on signing, 50% on delivery. Includes two rounds of revisions. Confidentiality maintained per mutual NDA. Valid for 30 days.",
    },
    {
        "slug": "software-development",
        "name": "Software Development Proposal",
        "description": "Technical project proposal covering architecture, sprints, testing, and deployment.",
        "sections": [
            {"title": "Project Overview", "hint": "Describe the software to be built, the problem it solves, and key users."},
            {"title": "Technical Approach", "hint": "Explain your development methodology (Agile/Scrum), tech stack, and integrations."},
            {"title": "Architecture & Design", "hint": "Outline system architecture, data models, and key design decisions."},
            {"title": "Sprint Plan", "hint": "Break the project into 2-week sprints with deliverables per sprint."},
            {"title": "QA & Testing Strategy", "hint": "Describe testing approach: unit tests, integration tests, UAT, and acceptance criteria."},
            {"title": "Deployment & Support", "hint": "Cover deployment plan, environments, CI/CD, and post-launch support."},
            {"title": "Budget & Timeline", "hint": "Itemize costs by phase or role with a total timeline."},
        ],
        "default_terms": "Payment: 30% upfront, 40% at midpoint, 30% on launch. Source code ownership transfers on final payment. 30-day bug-fix warranty included.",
    },
    {
        "slug": "marketing-services",
        "name": "Marketing Services Proposal",
        "description": "Campaign proposal with strategy, channels, creative direction, and ROI projections.",
        "sections": [
            {"title": "Campaign Brief", "hint": "Summarize the campaign goals, target audience, and key messages."},
            {"title": "Market Analysis", "hint": "Present relevant market data, competitor insights, and opportunities."},
            {"title": "Strategy & Channels", "hint": "Detail the marketing channels, tactics, and content calendar."},
            {"title": "Creative Direction", "hint": "Describe the visual and messaging approach, brand guidelines, and key assets."},
            {"title": "Budget Allocation", "hint": "Break down spend by channel: paid ads, content, tools, and management fees."},
            {"title": "KPIs & Measurement", "hint": "Define success metrics, reporting cadence, and optimization approach."},
        ],
        "default_terms": "Monthly retainer billed on the 1st. Ad spend billed at cost plus 15% management fee. 30-day cancellation notice required. Monthly performance reports included.",
    },
    {
        "slug": "freelance",
        "name": "Freelance Proposal",
        "description": "Streamlined freelance template with scope, deliverables, rate, and terms.",
        "sections": [
            {"title": "Introduction", "hint": "Introduce yourself and explain why you're the right fit for this project."},
            {"title": "Understanding of Needs", "hint": "Restate the client's requirements to show you understand the project."},
            {"title": "Proposed Solution", "hint": "Describe your approach and what you will build or deliver."},
            {"title": "Deliverables & Timeline", "hint": "List each deliverable with an estimated completion date."},
            {"title": "Pricing", "hint": "State your rate (hourly/fixed) and total project cost with payment schedule."},
            {"title": "Terms & Conditions", "hint": "Cover revisions, IP ownership, communication expectations, and cancellation policy."},
        ],
        "default_terms": "Fixed price as quoted. Includes two revision rounds. Additional revisions at $100/hour. 50% deposit required to begin. Net 14 payment terms.",
    },
]


@router.get("/seed-templates")
def get_seed_templates() -> list[dict]:
    return SEED_TEMPLATES


@router.post("/builder/pdf")
def builder_export_pdf(payload: ProposalBuilderRequest) -> Response:
    totals = calculate_totals(
        [{"description": i.description, "quantity": str(i.quantity), "unit_price": str(i.unit_price)} for i in payload.pricing_items] if payload.pricing_items else None,
        payload.discount_percent if payload.discount_percent > 0 else None,
        payload.tax_percent if payload.tax_percent > 0 else None,
    )

    pdf_data = {
        "title": payload.title or "Untitled Proposal",
        "business_name": payload.business_name or "Your Business",
        "business_email": payload.business_email,
        "business_phone": "",
        "business_address": "",
        "client_name": payload.client_name,
        "client_email": payload.client_email,
        "client_company": payload.client_company,
        "sections": [{"title": s.title, "content": s.content} for s in payload.sections],
        "pricing_items": totals["items"] if totals["items"] else [],
        "subtotal": str(totals["subtotal"]),
        "discount_percent": str(payload.discount_percent) if payload.discount_percent > 0 else None,
        "discount_amount": str(totals.get("discount_amount", 0)),
        "tax_percent": str(payload.tax_percent) if payload.tax_percent > 0 else None,
        "tax_amount": str(totals.get("tax_amount", 0)),
        "total": str(totals["total"]),
        "terms": payload.terms,
        "validity_days": payload.validity_days,
    }

    pdf_bytes = generate_pdf(pdf_data)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="proposal.pdf"'},
    )
