from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from redis import Redis
from rq import SimpleWorker
from rq.timeouts import TimerDeathPenalty

from app.core.config import settings

if __name__ == "__main__":
    conn = Redis.from_url(settings.redis_url)
    worker = SimpleWorker(["score_jobs", "notify_jobs"], connection=conn)
    worker.death_penalty_class = TimerDeathPenalty
    worker.work(with_scheduler=True)
