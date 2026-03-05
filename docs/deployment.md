# Deployment Notes

## Local
1. `docker compose -f infra/docker-compose.yml up --build -d postgres redis`
2. `cd backend`
3. `pip install -r requirements.txt`
4. `python scripts/migrate.py`
5. `python scripts/seed.py`
6. `uvicorn app.main:app --reload --port 8000`
7. `python scripts/worker.py`

## Full Docker (local stack)
- `docker compose -f infra/docker-compose.yml up --build`
- Then run migrations + seed inside API container:
  - `docker exec -it local-fame-api python scripts/migrate.py`
  - `docker exec -it local-fame-api python scripts/seed.py`

## Production Docker
1. Copy `.env.production.example` to `.env.production` and fill real values.
2. Run:
   - `docker compose -f infra/docker-compose.prod.yml --env-file .env.production up -d --build`

## Render Deployment
- Use `infra/render.yaml` as blueprint for API + worker.
- Provision managed Postgres + Redis in Render.
- Set environment variables from `.env.production.example`.
- Run DB migration once after first deploy:
  - `python scripts/migrate.py`
- Optionally run seed only for demo environments.

## Frontend Deployment (web)
- Build static web bundle:
  - `cd frontend`
  - `npm ci`
  - `npm run web:build`
- Deploy `frontend/dist` to static hosting (Netlify/Vercel/S3+CloudFront).
- Set `EXPO_PUBLIC_API_URL` to production API URL before build.

## 10M User Scaling Plan
- API horizontal autoscaling with stateless JWT auth.
- Read replicas for discovery and feed traffic.
- Redis queue workers for score recompute and notification fanout.
- Periodic job scheduler for daily viral alerts.
- Materialized trend views + cache keys by city/category/radius.
- Shard campaign matching pipelines by region.
- Add CDC/event stream for incremental metric ingestion.
