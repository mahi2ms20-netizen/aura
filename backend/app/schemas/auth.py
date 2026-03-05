from pydantic import BaseModel, EmailStr


class RegisterIn(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "user"
    city: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
