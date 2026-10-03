from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.business import BusinessPlan
from app.models.user import UserRole


class BusinessOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    website: str | None = None
    logo_url: str | None = None
    brand_color: str | None = None
    plan: BusinessPlan
    is_active: bool
    created_at: datetime


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    full_name: str | None = None
    role: UserRole
    is_active: bool
    business_id: int
    created_at: datetime


class MeOut(UserOut):
    business: BusinessOut


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)
    business_name: str = Field(max_length=255)
    phone: str | None = Field(default=None, max_length=20)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterResponse(BaseModel):
    user: UserOut
    business: BusinessOut
    access_token: str
    token_type: str = "bearer"
