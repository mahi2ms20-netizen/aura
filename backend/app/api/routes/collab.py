from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.models import User
from app.schemas.api import CollaborationRequestIn, CollaborationRequestOut
from app.services.discovery_service import service

router = APIRouter()


@router.get('/search')
def search(creator_id: str, radius_km: float = 10, category: str | None = None, min_followers: int | None = None, max_followers: int | None = None, db: Session = Depends(get_db)):
    import uuid

    return {
        'results': service.collab_search(db, uuid.UUID(creator_id), radius_km, category, min_followers, max_followers)
    }


@router.post('/requests', response_model=CollaborationRequestOut)
def create_request(payload: CollaborationRequestIn, db: Session = Depends(get_db), user: User = Depends(require_roles('creator', 'admin'))):
    req = service.create_collab_request(db, payload.requester_creator_id, payload.target_creator_id, payload.note)
    return {'id': req.id, 'status': req.status}
