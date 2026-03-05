from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.jobs.queue import notify_queue, score_queue
from app.models import User
from app.services.discovery_service import service

router = APIRouter()


@router.get('/{creator_id}')
def get_score(creator_id: UUID, db: Session = Depends(get_db)):
    return service.score_breakdown(db, creator_id)


@router.post('/recompute/{creator_id}')
def recompute(creator_id: UUID, db: Session = Depends(get_db), user: User = Depends(require_roles('admin'))):
    job = score_queue.enqueue('app.jobs.tasks.recompute_creator_score_job', str(creator_id))
    return {'job_id': job.id, 'status': 'queued'}


@router.post('/notify/daily')
def queue_daily_notifications(city: str = 'Hyderabad', user: User = Depends(require_roles('admin'))):
    job = notify_queue.enqueue('app.jobs.tasks.daily_viral_notifications_job', city)
    return {'job_id': job.id, 'status': 'queued', 'city': city}
