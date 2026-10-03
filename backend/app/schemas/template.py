from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TemplateSectionCreate(BaseModel):
    title: str = Field(max_length=255)
    content: str | None = None
    order: int = 0
    section_type: str = Field(default="text", max_length=50)


class TemplateSectionOut(TemplateSectionCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class TemplateCreate(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = None
    default_terms: str | None = None
    default_validity_days: int = Field(default=30, ge=1, le=365)
    pricing_table: dict | None = None
    sections: list[TemplateSectionCreate] = []


class TemplateUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    description: str | None = None
    default_terms: str | None = None
    default_validity_days: int | None = Field(default=None, ge=1, le=365)
    pricing_table: dict | None = None
    sections: list[TemplateSectionCreate] | None = None


class TemplateOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: str | None = None
    default_terms: str | None = None
    default_validity_days: int
    pricing_table: dict | None = None
    sections: list[TemplateSectionOut] = []
    created_at: datetime
    updated_at: datetime
