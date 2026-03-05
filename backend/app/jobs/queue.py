from redis import Redis
from rq import Queue

from app.core.config import settings

redis_conn = Redis.from_url(settings.redis_url)
score_queue = Queue('score_jobs', connection=redis_conn)
notify_queue = Queue('notify_jobs', connection=redis_conn)
