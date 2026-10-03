from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.proposal import ProposalStatus


class PricingItem(BaseModel):
    description: str
    quantity: Decimal = Decimal("1")
    unit_price: Decimal
    amount: Decimal | None = None


class ProposalSectionCreate(BaseModel):
    title: str = Field(max_length=255)
    content: str | None = None
    order: int = 0
    section_type: str = Field(default="text", max_length=50)


class ProposalSectionOut(ProposalSectionCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class ProposalCreate(BaseModel):
    title: str = Field(max_length=500)
    client_id: int | None = None
    template_id: int | None = None
    client_name: str | None = Field(default=None, max_length=255)
    client_email: str | None = Field(default=None, max_length=255)
    client_company: str | None = Field(default=None, max_length=255)
    pricing_items: list[PricingItem] | None = None
    discount_percent: Decimal | None = Field(default=None, ge=0, le=100)
    tax_percent: Decimal | None = Field(default=None, ge=0, le=100)
    terms: str | None = None
    notes: str | None = None
    validity_days: int = Field(default=30, ge=1, le=365)
    sections: list[ProposalSectionCreate] = []


class ProposalUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=500)
    client_id: int | None = None
    client_name: str | None = Field(default=None, max_length=255)
    client_email: str | None = Field(default=None, max_length=255)
    client_company: str | None = Field(default=None, max_length=255)
    status: ProposalStatus | None = None
    pricing_items: list[PricingItem] | None = None
    discount_percent: Decimal | None = Field(default=None, ge=0, le=100)
    tax_percent: Decimal | None = Field(default=None, ge=0, le=100)
    terms: str | None = None
    notes: str | None = None
    validity_days: int | None = Field(default=None, ge=1, le=365)
    sections: list[ProposalSectionCreate] | None = None


class ProposalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    client_id: int | None = None
    template_id: int | None = None
    status: ProposalStatus
    client_name: str | None = None
    client_email: str | None = None
    client_company: str | None = None
    subtotal: Decimal | None = None
    discount_percent: Decimal | None = None
    tax_percent: Decimal | None = None
    total: Decimal | None = None
    terms: str | None = None
    notes: str | None = None
    validity_days: int
    sent_at: datetime | None = None
    expires_at: datetime | None = None
    view_token: str | None = None
    pricing_items: list | None = None
    sections: list[ProposalSectionOut] = []
    created_at: datetime
    updated_at: datetime


class ProposalListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    status: ProposalStatus
    client_name: str | None = None
    client_company: str | None = None
    total: Decimal | None = None
    sent_at: datetime | None = None
    created_at: datetime


class GenerateRequest(BaseModel):
    template_id: int
    client_id: int | None = None
    brief: str = Field(max_length=2000)
    client_name: str | None = Field(default=None, max_length=255)
    client_company: str | None = Field(default=None, max_length=255)


class SignatureRequest(BaseModel):
    signer_name: str = Field(max_length=255)
    signer_email: str | None = Field(default=None, max_length=255)
    signature_data: str | None = None
    accepted: bool


class PublicProposalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    status: ProposalStatus
    client_name: str | None = None
    client_company: str | None = None
    subtotal: Decimal | None = None
    discount_percent: Decimal | None = None
    tax_percent: Decimal | None = None
    total: Decimal | None = None
    terms: str | None = None
    notes: str | None = None
    validity_days: int
    expires_at: datetime | None = None
    pricing_items: list | None = None
    sections: list[ProposalSectionOut] = []
    business_name: str | None = None
    business_logo: str | None = None
    business_email: str | None = None
    business_phone: str | None = None
    business_address: str | None = None
    business_website: str | None = None
