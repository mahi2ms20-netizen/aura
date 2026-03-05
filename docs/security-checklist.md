# Production Security Checklist

## Secrets
- Use unique, high-entropy `JWT_SECRET` in production.
- Never commit `.env` files with real credentials.
- Rotate DB and Redis credentials on a fixed schedule.
- Store secrets in cloud secret manager (AWS Secrets Manager / GCP Secret Manager / Render env vault).

## Authentication
- Keep access-token expiry <= 60 minutes.
- Add refresh-token flow before public launch.
- Enforce RBAC checks on all write/queue endpoints.

## API Hardening
- Add rate-limits on `/auth/*` and job-trigger endpoints.
- Add request logging with correlation IDs.
- Enable HTTPS only, with HSTS at edge.
- Restrict CORS to known frontend domains.

## Data & Infra
- Enable automated DB backups and retention policy.
- Run Postgres in private network; no public write access.
- Enable Redis auth and private networking.
- Turn on uptime checks and alerting for API + worker.

## CI/CD
- Require backend + frontend CI checks before merge.
- Add dependency update scanning (Dependabot).
- Block direct pushes to protected branch in production repos.
