import uuid
from dataclasses import dataclass

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_current_user
from app.db.session import get_db
from app.main import app


@dataclass
class DummyUser:
    id: uuid.UUID
    email: str
    full_name: str
    role: str
    city: str | None = None


def _dummy_db():
    yield None


@pytest.fixture
def client():
    app.dependency_overrides[get_db] = _dummy_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def admin_user() -> DummyUser:
    return DummyUser(uuid.uuid4(), "admin@localfame.app", "Admin", "admin", "Hyderabad")


@pytest.fixture
def brand_user() -> DummyUser:
    return DummyUser(uuid.uuid4(), "brand@localfame.app", "Brand", "brand", "Hyderabad")


@pytest.fixture
def regular_user() -> DummyUser:
    return DummyUser(uuid.uuid4(), "user@localfame.app", "User", "user", "Hyderabad")


def override_user(user: DummyUser):
    def _dep():
        return user

    app.dependency_overrides[get_current_user] = _dep
