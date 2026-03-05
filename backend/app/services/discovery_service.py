from collections import defaultdict
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import BrandCampaign, CollaborationRequest, ContentPost, Creator, CreatorScore
from app.schemas.api import (
    CampaignMatch,
    CreatorCard,
    CreatorDashboard,
    HeatPoint,
    ScoreBreakdown,
    ViralFeedItem,
)
from app.services.algorithms import fame_score, haversine_km, pricing_fit_score, rising_star_flag


class DiscoveryService:
    def _zone(self, distance_km: float) -> str:
        if distance_km <= 5:
            return "Zone 1 - Hyper Local"
        if distance_km <= 10:
            return "Zone 2 - City Trend"
        return "Zone 3 - Regional Stars"

    def _creator_card(self, creator: Creator, lat: float, lng: float) -> CreatorCard:
        distance = haversine_km(lat, lng, creator.latitude, creator.longitude)
        score = fame_score(
            creator.avg_engagement_rate,
            creator.avg_views,
            creator.avg_shares,
            creator.growth_velocity,
            creator.follower_count,
            distance,
        )
        return CreatorCard(
            id=creator.id,
            handle=creator.handle,
            display_name=creator.display_name,
            category=creator.category,
            city=creator.city,
            area=creator.area or "",
            lat=creator.latitude,
            lng=creator.longitude,
            distance_km=round(distance, 2),
            follower_count=creator.follower_count,
            engagement_rate=creator.avg_engagement_rate,
            fame_score=score,
            rising_star=rising_star_flag(creator.follower_count, creator.avg_views, creator.growth_velocity, creator.avg_engagement_rate),
            zone=self._zone(distance),
        )

    def nearby(self, db: Session, lat: float, lng: float, radius_km: float, category: str | None = None) -> list[CreatorCard]:
        creators = db.scalars(select(Creator)).all()
        cards = [self._creator_card(c, lat, lng) for c in creators]
        cards = [c for c in cards if c.distance_km <= radius_km and (category is None or c.category == category)]
        cards.sort(key=lambda x: (-x.fame_score, x.distance_km))
        return cards

    def trending_categories(self, db: Session, city: str) -> list[dict]:
        creators = db.scalars(select(Creator).where(Creator.city.ilike(city))).all()
        bucket: dict[str, float] = defaultdict(float)
        for c in creators:
            score = fame_score(c.avg_engagement_rate, c.avg_views, c.avg_shares, c.growth_velocity, c.follower_count, 2.0)
            bucket[c.category] += score
        return sorted(({"category": k, "score": round(v, 2)} for k, v in bucket.items()), key=lambda x: -x["score"])

    def heatmap(self, db: Session, city: str, category: str | None = None) -> list[HeatPoint]:
        query = select(Creator).where(Creator.city.ilike(city))
        if category:
            query = query.where(Creator.category == category)
        creators = db.scalars(query).all()
        return [
            HeatPoint(
                lat=c.latitude,
                lng=c.longitude,
                category=c.category,
                intensity=fame_score(c.avg_engagement_rate, c.avg_views, c.avg_shares, c.growth_velocity, c.follower_count, 3.0),
            )
            for c in creators
        ]

    def dashboard(self, db: Session, creator_id: UUID, lat: float, lng: float) -> CreatorDashboard:
        creator = db.get(Creator, creator_id)
        if creator is None:
            raise ValueError("creator not found")

        card = self._creator_card(creator, lat, lng)
        posts = db.scalars(select(ContentPost).where(ContentPost.creator_id == creator_id)).all()
        if not posts:
            now = datetime.now(timezone.utc)
            posts = [
                ContentPost(creator_id=creator_id, title="No content yet", permalink="", posted_at=now, views=0, likes=0, shares=0, comments=0)
            ]

        latest = sorted(posts, key=lambda p: p.posted_at, reverse=True)[0]
        most_viewed = sorted(posts, key=lambda p: p.views, reverse=True)[0]
        most_liked = sorted(posts, key=lambda p: p.likes, reverse=True)[0]

        return CreatorDashboard(
            creator=card,
            latest_viral_reel={"title": latest.title, "views": latest.views, "permalink": latest.permalink},
            most_viewed_reel={"title": most_viewed.title, "views": most_viewed.views, "permalink": most_viewed.permalink},
            most_liked_post={"title": most_liked.title, "likes": most_liked.likes, "permalink": most_liked.permalink},
            growth_trend=creator.growth_velocity,
        )

    def viral_feed(self, db: Session, lat: float, lng: float, radius_km: float, limit: int) -> list[ViralFeedItem]:
        posts = db.scalars(select(ContentPost)).all()
        items: list[ViralFeedItem] = []
        for p in posts:
            creator = db.get(Creator, p.creator_id)
            if creator is None:
                continue
            dist = haversine_km(lat, lng, creator.latitude, creator.longitude)
            if dist > radius_km:
                continue
            items.append(
                ViralFeedItem(
                    creator_id=creator.id,
                    creator_name=creator.display_name,
                    handle=creator.handle,
                    distance_km=round(dist, 2),
                    views=p.views,
                    title=p.title or "Untitled",
                    posted_at=p.posted_at,
                )
            )
        items.sort(key=lambda x: (-x.views, x.distance_km))
        return items[:limit]

    def creator_rank(self, db: Session, creator_id: UUID, city: str) -> dict:
        creators = db.scalars(select(Creator).where(Creator.city.ilike(city))).all()
        ranked = sorted(
            creators,
            key=lambda c: -fame_score(c.avg_engagement_rate, c.avg_views, c.avg_shares, c.growth_velocity, c.follower_count, 2.0),
        )
        for idx, creator in enumerate(ranked, 1):
            if creator.id == creator_id:
                return {"creator_id": creator_id, "rank": idx, "city": city, "total": len(ranked)}
        return {"creator_id": creator_id, "rank": None, "city": city, "total": len(ranked)}

    def collab_search(self, db: Session, creator_id: UUID, radius_km: float, category: str | None, min_followers: int | None, max_followers: int | None) -> list[CreatorCard]:
        source = db.get(Creator, creator_id)
        if source is None:
            return []
        cards = self.nearby(db, source.latitude, source.longitude, radius_km, category)
        filtered = []
        for c in cards:
            if c.id == creator_id:
                continue
            if min_followers is not None and c.follower_count < min_followers:
                continue
            if max_followers is not None and c.follower_count > max_followers:
                continue
            filtered.append(c)
        return filtered

    def create_collab_request(self, db: Session, requester_creator_id: UUID, target_creator_id: UUID, note: str | None) -> CollaborationRequest:
        req = CollaborationRequest(
            requester_creator_id=requester_creator_id,
            target_creator_id=target_creator_id,
            note=note,
            status="pending",
        )
        db.add(req)
        db.commit()
        db.refresh(req)
        return req

    def create_campaign(self, db: Session, payload: dict) -> BrandCampaign:
        campaign = BrandCampaign(**payload, status="active")
        db.add(campaign)
        db.commit()
        db.refresh(campaign)
        return campaign

    def campaign_matches(self, db: Session, campaign_id: UUID, lat: float, lng: float) -> list[CampaignMatch]:
        campaign = db.get(BrandCampaign, campaign_id)
        if campaign is None:
            return []

        nearby_creators = self.nearby(db, lat, lng, float(campaign.radius_km), campaign.category)
        matches: list[CampaignMatch] = []
        for c in nearby_creators:
            score = pricing_fit_score(c.follower_count, c.engagement_rate, campaign.min_followers)
            matches.append(
                CampaignMatch(
                    creator_id=c.id,
                    handle=c.handle,
                    display_name=c.display_name,
                    distance_km=c.distance_km,
                    engagement_rate=c.engagement_rate,
                    follower_count=c.follower_count,
                    pricing_estimate_inr=next((x.pricing_estimate_inr or 0 for x in db.scalars(select(Creator).where(Creator.id == c.id)).all()), 0),
                    match_score=score,
                )
            )
        matches.sort(key=lambda x: -x.match_score)
        return matches

    def score_breakdown(self, db: Session, creator_id: UUID, lat: float = 17.43, lng: float = 78.41) -> ScoreBreakdown:
        creator = db.get(Creator, creator_id)
        if creator is None:
            raise ValueError("creator not found")
        distance = haversine_km(lat, lng, creator.latitude, creator.longitude)
        score = fame_score(creator.avg_engagement_rate, creator.avg_views, creator.avg_shares, creator.growth_velocity, creator.follower_count, distance)

        breakdown = {
            "engagement_rate": creator.avg_engagement_rate,
            "avg_views": creator.avg_views,
            "avg_shares": creator.avg_shares,
            "growth_velocity": creator.growth_velocity,
            "follower_count": creator.follower_count,
            "distance_km": round(distance, 2),
        }

        row = db.get(CreatorScore, creator_id)
        if row is None:
            row = CreatorScore(
                creator_id=creator_id,
                fame_score=score,
                growth_velocity=creator.growth_velocity,
                rising_star=rising_star_flag(creator.follower_count, creator.avg_views, creator.growth_velocity, creator.avg_engagement_rate),
                score_breakdown=breakdown,
            )
            db.add(row)
        else:
            row.fame_score = score
            row.growth_velocity = creator.growth_velocity
            row.rising_star = rising_star_flag(creator.follower_count, creator.avg_views, creator.growth_velocity, creator.avg_engagement_rate)
            row.score_breakdown = breakdown
        db.commit()

        return ScoreBreakdown(
            creator_id=creator_id,
            fame_score=score,
            rising_star=row.rising_star,
            growth_velocity=creator.growth_velocity,
            breakdown=breakdown,
        )


service = DiscoveryService()
