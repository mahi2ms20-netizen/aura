from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.api import ViralFeedResponse
from app.services.discovery_service import service

router = APIRouter()


@router.get('/viral-near-you', response_model=ViralFeedResponse)
def viral_near_you(lat: float, lng: float, radius_km: float = Query(default=10, ge=1, le=25), limit: int = Query(default=20, ge=1, le=100), db: Session = Depends(get_db)):
    return {'items': service.viral_feed(db, lat, lng, radius_km, limit)}
