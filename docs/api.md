# API Specification (v1)

Base: `/api/v1`

## Health
- `GET /health`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

## Discovery
- `GET /discover/nearby?lat={lat}&lng={lng}&radius_km={n}&category={opt}`
- `GET /discover/famous-near-me?lat={lat}&lng={lng}&radius_km={n}`
- `GET /discover/rising-stars?lat={lat}&lng={lng}&radius_km={n}`
- `GET /discover/trending-categories?city={city}`

## Map
- `GET /map/heatmap?city={city}&category={opt}&zoom={z}`

## Creator
- `GET /creators/{creator_id}/dashboard?lat={lat}&lng={lng}`
- `GET /creators/{creator_id}/analytics`
- `GET /creators/{creator_id}/rank?city={city}`

## Feed
- `GET /feed/viral-near-you?lat={lat}&lng={lng}&radius_km={n}&limit={k}`

## Collaboration
- `GET /collab/search?creator_id={id}&radius_km={n}&category={opt}&min_followers={n}&max_followers={n}`
- `POST /collab/requests` (role: creator/admin)

## Brands
- `POST /brands/campaigns` (role: brand/admin)
- `GET /brands/campaigns/{campaign_id}/matches?lat={lat}&lng={lng}` (role: brand/admin)

## Scores and Jobs
- `GET /scores/{creator_id}`
- `POST /scores/recompute/{creator_id}` (role: admin, enqueues Redis job)
- `POST /scores/notify/daily?city={city}` (role: admin, enqueues Redis job)
