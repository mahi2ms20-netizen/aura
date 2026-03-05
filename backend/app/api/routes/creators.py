from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.discovery_service import service

router = APIRouter()


@router.get('/{creator_id}/dashboard')
def dashboard(creator_id: UUID, lat: float, lng: float, db: Session = Depends(get_db)):
    return service.dashboard(db, creator_id, lat, lng)


@router.get('/{creator_id}/analytics')
def analytics(creator_id: UUID, db: Session = Depends(get_db)):
    score = service.score_breakdown(db, creator_id)
    return {
        'creator_id': str(score.creator_id),
        'fame_score': score.fame_score,
        'growth_velocity': score.growth_velocity,
        'rising_star': score.rising_star,
    }


@router.get('/{creator_id}/rank')
def rank(creator_id: UUID, city: str, db: Session = Depends(get_db)):
    return service.creator_rank(db, creator_id, city)
