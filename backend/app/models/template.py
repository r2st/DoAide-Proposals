from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, JSONType, SoftDeleteMixin, TimestampMixin


class Template(Base, TimestampMixin, SoftDeleteMixin, BusinessScopedMixin):
    __tablename__ = "templates"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    default_terms: Mapped[str | None] = mapped_column(Text, nullable=True)
    default_validity_days: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    pricing_table: Mapped[dict | None] = mapped_column(JSONType, nullable=True)

    sections: Mapped[list[TemplateSection]] = relationship(
        back_populates="template", cascade="all, delete-orphan", order_by="TemplateSection.order"
    )


class TemplateSection(Base, TimestampMixin):
    __tablename__ = "template_sections"

    id: Mapped[int] = mapped_column(primary_key=True)
    template_id: Mapped[int] = mapped_column(
        ForeignKey("templates.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    section_type: Mapped[str] = mapped_column(String(50), default="text", nullable=False)

    template: Mapped[Template] = relationship(back_populates="sections")
