# Local Fame - Discover Influencers Near You

Local Fame is a mobile-first platform to discover creators geographically, rank local influence, detect rising stars, and connect creators with brands.

## What is Included
- Architecture and plan: `docs/architecture.md`
- Database schema: `docs/schema.sql`
- API specification: `docs/api.md`
- Deployment and scaling strategy: `docs/deployment.md`
- Security checklist: `docs/security-checklist.md`
- FastAPI backend: `backend/`
- Expo React Native frontend: `frontend/`
- Docker compose infra: `infra/docker-compose.yml`
- Production deploy compose: `infra/docker-compose.prod.yml`
- Render blueprint: `infra/render.yaml`

## Backend Setup
1. `cd backend`
2. `py -m pip install -r requirements.txt`
3. `set DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/localfame`
4. `set REDIS_URL=redis://localhost:6379/0`
5. `python scripts/migrate.py`
6. `python scripts/seed.py`
7. `uvicorn app.main:app --reload --port 8000`

Run worker in another terminal:
- `cd backend`
- `python scripts/worker.py`

## Demo Accounts (seed)
- admin: `admin@localfame.app` / `admin1234`
- brand: `brand@localfame.app` / `brand1234`

## Frontend Setup (Web)
1. `cd frontend`
2. `npm install`
3. Set `EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1`
4. `npm run web`

## CI
- Backend CI: `.github/workflows/backend-ci.yml`
- Frontend CI: `.github/workflows/frontend-ci.yml`

## Local Docker Setup
1. `docker compose -f infra/docker-compose.yml up --build`
2. Run migrations + seed inside container:
   - `docker exec -it local-fame-api python scripts/migrate.py`
   - `docker exec -it local-fame-api python scripts/seed.py`

## Core Features Implemented
- Influencer discovery zones (0-5km, 5-10km, 10-25km)
- Famous near me
- Rising creator radar
- Viral near you feed
- Influencer heatmap endpoint
- Creator dashboard insights
- Collaboration search + protected collaboration requests
- Brand campaign creation + protected local influencer matching
- Fame score algorithm and score breakdown endpoint
- JWT auth + RBAC
- Redis background jobs for score recompute and daily notifications
- Admin web controls for job triggers
