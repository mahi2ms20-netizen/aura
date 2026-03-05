from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.api import HeatmapResponse
from app.services.discovery_service import service

router = APIRouter()


@router.get('/heatmap', response_model=HeatmapResponse)
def heatmap(city: str, category: str | None = None, zoom: int = 12, db: Session = Depends(get_db)):
    points = service.heatmap(db, city, category)
    return {'city': city, 'points': points}
