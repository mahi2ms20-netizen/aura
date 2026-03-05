-- PostgreSQL + PostGIS schema for AURA
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','creator','brand','admin')),
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE creators (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  category TEXT NOT NULL,
  follower_count BIGINT NOT NULL DEFAULT 0,
  avg_engagement_rate NUMERIC(8,4) NOT NULL DEFAULT 0,
  pricing_estimate_inr NUMERIC(12,2),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE social_profiles (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  username TEXT NOT NULL,
  followers BIGINT NOT NULL DEFAULT 0,
  UNIQUE (creator_id, platform)
);

CREATE TABLE creator_locations (
  creator_id UUID PRIMARY KEY REFERENCES creators(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  area TEXT,
  geom GEOGRAPHY(POINT,4326) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_creator_locations_geom ON creator_locations USING GIST (geom);

CREATE TABLE content_posts (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  title TEXT,
  permalink TEXT,
  posted_at TIMESTAMPTZ NOT NULL,
  views BIGINT NOT NULL DEFAULT 0,
  likes BIGINT NOT NULL DEFAULT 0,
  shares BIGINT NOT NULL DEFAULT 0,
  comments BIGINT NOT NULL DEFAULT 0,
  category TEXT
);
CREATE INDEX idx_content_creator_posted ON content_posts (creator_id, posted_at DESC);

CREATE TABLE engagement_snapshots (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  snapshot_at TIMESTAMPTZ NOT NULL,
  followers BIGINT NOT NULL,
  avg_views BIGINT NOT NULL,
  avg_likes BIGINT NOT NULL,
  avg_shares BIGINT NOT NULL,
  engagement_rate NUMERIC(8,4) NOT NULL
);
CREATE INDEX idx_engagement_creator_time ON engagement_snapshots (creator_id, snapshot_at DESC);

CREATE TABLE creator_scores (
  creator_id UUID PRIMARY KEY REFERENCES creators(id) ON DELETE CASCADE,
  fame_score NUMERIC(8,2) NOT NULL,
  growth_velocity NUMERIC(10,4) NOT NULL,
  rising_star BOOLEAN NOT NULL DEFAULT FALSE,
  score_breakdown JSONB NOT NULL,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE collaboration_requests (
  id UUID PRIMARY KEY,
  requester_creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  target_creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','accepted','rejected','expired')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE brand_campaigns (
  id UUID PRIMARY KEY,
  brand_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  objective TEXT,
  category TEXT,
  city TEXT,
  radius_km NUMERIC(6,2) NOT NULL,
  min_followers BIGINT,
  budget_inr NUMERIC(12,2),
  status TEXT NOT NULL CHECK (status IN ('draft','active','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaign_matches (
  id UUID PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES brand_campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  match_score NUMERIC(8,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, creator_id)
);

CREATE TABLE trend_snapshots (
  id UUID PRIMARY KEY,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  score NUMERIC(10,2) NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_trend_city_period ON trend_snapshots (city, period_end DESC);

