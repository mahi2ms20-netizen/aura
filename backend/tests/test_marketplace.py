import uuid
from types import SimpleNamespace

import app.api.routes.brands as brands_route
from tests.conftest import override_user


def _campaign_payload(brand_user_id: str):
    return {
        "brand_user_id": brand_user_id,
        "title": "Restaurant Launch Push",
        "objective": "Drive local footfall",
        "category": "food",
        "city": "Hyderabad",
        "radius_km": 12,
        "min_followers": 10000,
        "budget_inr": 150000,
    }


def test_create_campaign_success_for_brand(client, brand_user, monkeypatch):
    override_user(brand_user)

    def fake_create_campaign(db, payload):
        return SimpleNamespace(id=uuid.uuid4(), status="active")

    monkeypatch.setattr(brands_route.service, "create_campaign", fake_create_campaign)
    response = client.post("/api/v1/brands/campaigns", json=_campaign_payload(str(brand_user.id)))
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "active"
    assert body["id"]


def test_create_campaign_forbidden_for_regular_user(client, regular_user):
    override_user(regular_user)
    response = client.post("/api/v1/brands/campaigns", json=_campaign_payload(str(regular_user.id)))
    assert response.status_code == 403
