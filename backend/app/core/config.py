import os
from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "AURA API"
    app_version: str = "0.2.0"
    api_prefix: str = "/api/v1"
    database_url: str = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/localfame")
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    jwt_secret: str = os.getenv("JWT_SECRET", "change-me-in-production")
    jwt_algorithm: str = "HS256"
    access_token_exp_minutes: int = int(os.getenv("ACCESS_TOKEN_EXP_MINUTES", "120"))


settings = Settings()

