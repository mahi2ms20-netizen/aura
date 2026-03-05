from datetime import datetime, timezone
from sqlalchemy import select

from app.db.session import SessionLocal
from app.models import Creator
from app.services.discovery_service import service


def recompute_creator_score_job(creator_id: str) -> dict:
    import uuid

    db = SessionLocal()
    try:
        score = service.score_breakdown(db, uuid.UUID(creator_id))
        return {'creator_id': creator_id, 'fame_score': score.fame_score, 'computed_at': datetime.now(timezone.utc).isoformat()}
    finally:
        db.close()


def daily_viral_notifications_job(city: str = 'Hyderabad') -> dict:
    db = SessionLocal()
    try:
        creators = db.scalars(select(Creator).where(Creator.city.ilike(city))).all()
        alerts = []
        for c in creators:
            if c.avg_views >= 1_000_000:
                alerts.append(f"{c.display_name} near you crossed 1M average views")
        return {'city': city, 'alerts_count': len(alerts), 'alerts': alerts[:50]}
    finally:
        db.close()
