from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class CreatorCard(BaseModel):
    id: UUID
    handle: str
    display_name: str
    category: str
    city: str
    area: str
    lat: float
    lng: float
    distance_km: float
    follower_count: int
    engagement_rate: float
    fame_score: float
    rising_star: bool
    zone: str


class NearbyResponse(BaseModel):
    radius_km: float
    total: int
    creators: list[CreatorCard]


class HeatPoint(BaseModel):
    lat: float
    lng: float
    category: str
    intensity: float


class HeatmapResponse(BaseModel):
    city: str
    points: list[HeatPoint]


class CreatorDashboard(BaseModel):
    creator: CreatorCard
    latest_viral_reel: dict
    most_viewed_reel: dict
    most_liked_post: dict
    growth_trend: float


class ViralFeedItem(BaseModel):
    creator_id: UUID
    creator_name: str
    handle: str
    distance_km: float
    views: int
    title: str
    posted_at: datetime


class ViralFeedResponse(BaseModel):
    items: list[ViralFeedItem]


class CollaborationRequestIn(BaseModel):
    requester_creator_id: UUID
    target_creator_id: UUID
    note: str | None = None


class CollaborationRequestOut(BaseModel):
    id: UUID
    status: str


class CampaignIn(BaseModel):
    brand_user_id: UUID
    title: str
    objective: str | None = None
    category: str | None = None
    city: str
    radius_km: float
    min_followers: int | None = None
    budget_inr: float | None = None


class CampaignOut(BaseModel):
    id: UUID
    status: str


class CampaignMatch(BaseModel):
    creator_id: UUID
    handle: str
    display_name: str
    distance_km: float
    engagement_rate: float
    follower_count: int
    pricing_estimate_inr: float
    match_score: float


class CampaignMatchesResponse(BaseModel):
    campaign_id: UUID
    matches: list[CampaignMatch]


class ScoreBreakdown(BaseModel):
    creator_id: UUID
    fame_score: float
    rising_star: bool
    growth_velocity: float
    breakdown: dict
