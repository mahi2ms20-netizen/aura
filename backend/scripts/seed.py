from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models import ContentPost, Creator, User


def run() -> None:
    db = SessionLocal()
    try:
        if db.scalar(select(User).where(User.email == "admin@localfame.app")) is None:
            db.add(
                User(
                    email="admin@localfame.app",
                    full_name="Platform Admin",
                    role="admin",
                    hashed_password=hash_password("admin1234"),
                    city="Hyderabad",
                )
            )
            db.add(
                User(
                    email="brand@localfame.app",
                    full_name="Demo Brand",
                    role="brand",
                    hashed_password=hash_password("brand1234"),
                    city="Hyderabad",
                )
            )

        existing = db.scalar(select(Creator.id).limit(1))
        if existing is None:
            creators = [
                Creator(handle="foodieanika", display_name="Anika Rao", category="food", city="Hyderabad", area="Jubilee Hills", latitude=17.4323, longitude=78.4071, follower_count=84000, avg_engagement_rate=0.081, avg_views=210000, avg_shares=9000, growth_velocity=0.091, pricing_estimate_inr=45000),
                Creator(handle="laughwithraj", display_name="Raj Varma", category="comedy", city="Hyderabad", area="Madhapur", latitude=17.4483, longitude=78.3915, follower_count=120000, avg_engagement_rate=0.072, avg_views=340000, avg_shares=12000, growth_velocity=0.085, pricing_estimate_inr=60000),
                Creator(handle="fitmira", display_name="Mira Das", category="fitness", city="Hyderabad", area="Gachibowli", latitude=17.4401, longitude=78.3489, follower_count=42000, avg_engagement_rate=0.095, avg_views=155000, avg_shares=5100, growth_velocity=0.122, pricing_estimate_inr=30000),
            ]
            db.add_all(creators)
            db.flush()

            now = datetime.now(timezone.utc)
            posts = []
            for c in creators:
                posts.append(ContentPost(creator_id=c.id, platform="instagram", content_type="reel", title=f"Latest from {c.display_name}", permalink=f"https://example.com/{c.handle}/latest", posted_at=now - timedelta(hours=4), views=c.avg_views, likes=int(c.avg_views * 0.13), shares=c.avg_shares, comments=120, category=c.category))
                posts.append(ContentPost(creator_id=c.id, platform="instagram", content_type="reel", title=f"Most viewed by {c.display_name}", permalink=f"https://example.com/{c.handle}/top", posted_at=now - timedelta(days=2), views=int(c.avg_views * 1.8), likes=int(c.avg_views * 0.2), shares=int(c.avg_shares * 1.5), comments=450, category=c.category))
            db.add_all(posts)

        db.commit()
        print("Seed complete")
    finally:
        db.close()


if __name__ == "__main__":
    run()
