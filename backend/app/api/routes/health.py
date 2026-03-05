from fastapi import APIRouter
from sqlalchemy import text

from app.db.session import SessionLocal
from app.jobs.queue import redis_conn

router = APIRouter()


@router.get('/health')
def health() -> dict:
    db_ok = False
    redis_ok = False

    db = SessionLocal()
    try:
        db.execute(text('SELECT 1'))
        db_ok = True
    except Exception:
        db_ok = False
    finally:
        db.close()

    try:
        redis_conn.ping()
        redis_ok = True
    except Exception:
        redis_ok = False

    return {'status': 'ok' if db_ok else 'degraded', 'database': db_ok, 'redis': redis_ok}
