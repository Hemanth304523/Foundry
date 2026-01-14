from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Literal
from datetime import datetime


# Admin schemas
class AdminCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("username")
    @classmethod
    def username_must_be_alphanumeric(cls, v):
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Username must be alphanumeric (with optional _ or -)")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class AdminResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: AdminResponse


# Code Snippet schemas
class CodeSnippetCreate(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    language: str = Field(min_length=1, max_length=50)
    code: str = Field(min_length=1)


class CodeSnippetUpdate(BaseModel):
    filename: Optional[str] = Field(None, min_length=1, max_length=255)
    language: Optional[str] = Field(None, min_length=1, max_length=50)
    code: Optional[str] = Field(None, min_length=1)


class CodeSnippetResponse(BaseModel):
    id: int
    filename: str
    language: str
    code: str
    created_at: datetime

    class Config:
        from_attributes = True


# Component schemas
class ComponentCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    use_case: str = Field(min_length=10)
    category: Literal["frontend", "backend", "database", "devops"]


class ComponentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    use_case: Optional[str] = Field(None, min_length=10)
    category: Optional[Literal["frontend", "backend", "database", "devops"]] = None


class ComponentResponse(BaseModel):
    id: int
    title: str
    use_case: str
    category: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ComponentWithSnippetsResponse(BaseModel):
    id: int
    title: str
    use_case: str
    category: str
    snippets: List[CodeSnippetResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Category schemas
class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
