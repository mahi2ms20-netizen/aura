from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.models import User
from app.schemas.api import CampaignIn, CampaignMatchesResponse, CampaignOut
from app.services.discovery_service import service

router = APIRouter()


@router.post('/campaigns', response_model=CampaignOut)
def create_campaign(payload: CampaignIn, db: Session = Depends(get_db), user: User = Depends(require_roles('brand', 'admin'))):
    created = service.create_campaign(db, payload.model_dump())
    return {'id': created.id, 'status': created.status}


@router.get('/campaigns/{campaign_id}/matches', response_model=CampaignMatchesResponse)
def campaign_matches(campaign_id: UUID, lat: float, lng: float, db: Session = Depends(get_db), user: User = Depends(require_roles('brand', 'admin'))):
    return {'campaign_id': campaign_id, 'matches': service.campaign_matches(db, campaign_id, lat, lng)}
