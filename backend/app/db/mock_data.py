from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import List
from uuid import UUID, uuid4


@dataclass
class CreatorRecord:
    id: UUID
    handle: str
    display_name: str
    category: str
    city: str
    area: str
    lat: float
    lng: float
    follower_count: int
    engagement_rate: float
    avg_views: int
    avg_shares: int
    growth_velocity: float
    pricing_estimate_inr: float


@dataclass
class ContentRecord:
    id: UUID
    creator_id: UUID
    title: str
    permalink: str
    posted_at: datetime
    views: int
    likes: int
    shares: int


def seed_creators() -> List[CreatorRecord]:
    return [
        CreatorRecord(uuid4(), "foodieanika", "Anika Rao", "food", "Hyderabad", "Jubilee Hills", 17.4323, 78.4071, 84000, 0.081, 210000, 9000, 0.091, 45000),
        CreatorRecord(uuid4(), "laughwithraj", "Raj Varma", "comedy", "Hyderabad", "Madhapur", 17.4483, 78.3915, 120000, 0.072, 340000, 12000, 0.085, 60000),
        CreatorRecord(uuid4(), "fitmira", "Mira Das", "fitness", "Hyderabad", "Gachibowli", 17.4401, 78.3489, 42000, 0.095, 155000, 5100, 0.122, 30000),
        CreatorRecord(uuid4(), "streetlensnaveen", "Naveen K", "photography", "Hyderabad", "Kondapur", 17.4698, 78.3656, 18000, 0.109, 98000, 3500, 0.141, 18000),
        CreatorRecord(uuid4(), "stylebysana", "Sana Ali", "fashion", "Hyderabad", "Banjara Hills", 17.4126, 78.4482, 230000, 0.064, 510000, 18000, 0.062, 95000),
        CreatorRecord(uuid4(), "techsai", "Sai Teja", "tech", "Hyderabad", "Hitech City", 17.4500, 78.3800, 37000, 0.074, 120000, 4200, 0.088, 38000),
    ]


def seed_content(creators: List[CreatorRecord]) -> List[ContentRecord]:
    now = datetime.now(timezone.utc)
    posts: List[ContentRecord] = []
    for c in creators:
        posts.append(ContentRecord(uuid4(), c.id, f"Latest from {c.display_name}", f"https://example.com/{c.handle}/latest", now - timedelta(hours=4), c.avg_views, int(c.avg_views * 0.13), c.avg_shares))
        posts.append(ContentRecord(uuid4(), c.id, f"Most viewed by {c.display_name}", f"https://example.com/{c.handle}/top", now - timedelta(days=2), int(c.avg_views * 1.8), int(c.avg_views * 0.2), int(c.avg_shares * 1.5)))
    return posts
