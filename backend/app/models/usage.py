from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, TimestampMixin


class UsageTracking(Base, TimestampMixin, BusinessScopedMixin):
    __tablename__ = "usage_tracking"

    id: Mapped[int] = mapped_column(primary_key=True)
    month: Mapped[str] = mapped_column(String(7), nullable=False)
    proposals_created: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
