# Local Fame Architecture and Implementation Plan

## 1) System Architecture

### Product Scope
Local Fame is a mobile-first, location-aware discovery platform that ranks and surfaces creators, rising stars, and local influencer opportunities for users and brands.

### High-Level Components
- Mobile App (React Native + Expo): map, feed, creator dashboards, collaboration finder, brand marketplace.
- API Layer (FastAPI): authentication-ready APIs, discovery endpoints, analytics, ranking, campaigns.
- Data Layer (PostgreSQL + PostGIS): creator profiles, metrics, geo-indexed locations, campaigns, collaboration graph.
- Cache Layer (Redis): hot discovery queries, neighborhood trends, fame score snapshots.
- Async Jobs (Celery/RQ-ready worker): score recomputation, trend detection, daily digests, notifications.
- Ingestion Layer (connector-ready): social metric imports from platform APIs or ETL files.

### Runtime Topology (Production)
- API behind load balancer (horizontal autoscaling)
- Worker fleet for batch and near-real-time recomputation
- Postgres primary + read replicas
- Redis cluster for low-latency geo feed cache
- Object store (S3/GCS) for media metadata snapshots
- Analytics stream (Kafka/PubSub optional)

### Core Request Flows
1. User opens app -> location obtained -> `GET /discover/nearby` + `GET /map/heatmap`.
2. API executes PostGIS distance queries + fame ranking.
3. Cached city/category trend tiles returned quickly.
4. User taps creator bubble -> creator dashboard with latest viral content and growth insights.

## 2) Data Model Summary

Entities:
- users
- creators
- social_profiles
- content_posts
- engagement_snapshots
- creator_scores
- creator_locations
- collaboration_requests
- brand_campaigns
- campaign_matches
- trend_snapshots

Geo:
- `creator_locations.geom` as `GEOGRAPHY(POINT, 4326)`
- GIST index for radius and heatmap queries

## 3) API Design

Main API groups:
- `/discover`: nearby creators, famous-near-me, rising-stars, categories
- `/creators`: profile dashboard, analytics, ranking
- `/collab`: collaboration search and requests
- `/brands`: campaign creation and influencer matching
- `/feed`: viral-near-you feed
- `/scores`: fame score breakdown and recompute hooks

## 4) Algorithms

- Fame Score: weighted normalized blend of engagement rate, views, shares, growth velocity, followers, and proximity relevance.
- Rising Star: high velocity and view/follower anomaly detection.
- Heatmap: geohash/grid cluster aggregation by category and rolling influence sum.
- Discovery Ranking: fame score adjusted by radius decay and user intent filters.

## 5) Security and Privacy

- JWT auth scaffold (production extension point)
- Rate limiting and abuse protections
- Data minimization for PII and explicit location consent
- Differential access for public users, creators, brands, admins

## 6) Scaling to 10M Users

- Query patterns split: read-heavy discovery isolated from write-heavy ingestion.
- Read replicas and cache-aside strategy for top endpoints.
- Precomputed city/category trend materialized views refreshed per minute.
- Background recomputation for score updates and anomaly detection.
- Observability: OpenTelemetry traces + RED metrics + SLO alerts.

## 7) Implementation Plan

1. Backend scaffolding and schema
2. Algorithm service layer
3. Discovery, creator, feed, collaboration, and marketplace APIs
4. Mobile app with 5 primary screens
5. Dockerized local infra
6. Deployment and scaling guides
