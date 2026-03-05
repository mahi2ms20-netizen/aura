from types import SimpleNamespace

import app.api.routes.scores as scores_route
from tests.conftest import override_user


def test_queue_daily_notify_job(client, admin_user, monkeypatch):
    override_user(admin_user)

    def fake_enqueue(*args, **kwargs):
        return SimpleNamespace(id="job-notify-1")

    monkeypatch.setattr(scores_route.notify_queue, "enqueue", fake_enqueue)
    response = client.post("/api/v1/scores/notify/daily?city=Hyderabad")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "queued"
    assert body["job_id"] == "job-notify-1"


def test_queue_recompute_job(client, admin_user, monkeypatch):
    override_user(admin_user)

    def fake_enqueue(*args, **kwargs):
        return SimpleNamespace(id="job-score-1")

    monkeypatch.setattr(scores_route.score_queue, "enqueue", fake_enqueue)
    response = client.post("/api/v1/scores/recompute/89c77274-1d00-4100-aa56-235e975eaa63")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "queued"
    assert body["job_id"] == "job-score-1"
