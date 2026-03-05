from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.api import NearbyResponse
from app.services.discovery_service import service

router = APIRouter()


@router.get('/nearby', response_model=NearbyResponse)
def nearby(lat: float, lng: float, radius_km: float = Query(default=10, ge=1, le=25), category: str | None = None, db: Session = Depends(get_db)):
    creators = service.nearby(db, lat, lng, radius_km, category)
    return {'radius_km': radius_km, 'total': len(creators), 'creators': creators}


@router.get('/famous-near-me', response_model=NearbyResponse)
def famous_near_me(lat: float, lng: float, radius_km: float = Query(default=5, ge=1, le=25), db: Session = Depends(get_db)):
    creators = service.nearby(db, lat, lng, radius_km)
    ranked = sorted(creators, key=lambda c: -c.fame_score)
    return {'radius_km': radius_km, 'total': len(ranked), 'creators': ranked}


@router.get('/rising-stars', response_model=NearbyResponse)
def rising_stars(lat: float, lng: float, radius_km: float = Query(default=10, ge=1, le=25), db: Session = Depends(get_db)):
    creators = [c for c in service.nearby(db, lat, lng, radius_km) if c.rising_star]
    return {'radius_km': radius_km, 'total': len(creators), 'creators': creators}


@router.get('/trending-categories')
def trending_categories(city: str, db: Session = Depends(get_db)):
    return {'city': city, 'categories': service.trending_categories(db, city)}
