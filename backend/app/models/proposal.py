from __future__ import annotations

from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, JSONType, SoftDeleteMixin, TimestampMixin


class ProposalStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    VIEWED = "viewed"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class Proposal(Base, TimestampMixin, SoftDeleteMixin, BusinessScopedMixin):
    __tablename__ = "proposals"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    client_id: Mapped[int | None] = mapped_column(
        ForeignKey("clients.id", ondelete="SET NULL"), nullable=True, index=True
    )
    template_id: Mapped[int | None] = mapped_column(
        ForeignKey("templates.id", ondelete="SET NULL"), nullable=True, index=True
    )
    status: Mapped[ProposalStatus] = mapped_column(
        SAEnum(ProposalStatus, native_enum=False, length=20),
        default=ProposalStatus.DRAFT,
        nullable=False,
    )
    client_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    client_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    client_company: Mapped[str | None] = mapped_column(String(255), nullable=True)

    subtotal: Mapped[float | None] = mapped_column(Numeric(16, 2), nullable=True)
    discount_percent: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    tax_percent: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    total: Mapped[float | None] = mapped_column(Numeric(16, 2), nullable=True)

    terms: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    validity_days: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    view_token: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)

    pricing_items: Mapped[list | None] = mapped_column(JSONType, nullable=True)

    sections: Mapped[list[ProposalSection]] = relationship(
        back_populates="proposal", cascade="all, delete-orphan", order_by="ProposalSection.order"
    )


class ProposalSection(Base, TimestampMixin):
    __tablename__ = "proposal_sections"

    id: Mapped[int] = mapped_column(primary_key=True)
    proposal_id: Mapped[int] = mapped_column(
        ForeignKey("proposals.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    section_type: Mapped[str] = mapped_column(String(50), default="text", nullable=False)

    proposal: Mapped[Proposal] = relationship(back_populates="sections")
