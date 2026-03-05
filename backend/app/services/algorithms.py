from math import atan2, cos, radians, sin, sqrt


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    earth_radius_km = 6371.0
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)
    a = sin(d_lat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return earth_radius_km * c


def clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def fame_score(
    engagement_rate: float,
    avg_views: int,
    avg_shares: int,
    growth_velocity: float,
    follower_count: int,
    distance_km: float,
) -> float:
    # Weighted local influence score normalized to 0-100.
    engagement_component = clamp01(engagement_rate / 0.15)
    views_component = clamp01(avg_views / 600_000)
    shares_component = clamp01(avg_shares / 30_000)
    growth_component = clamp01(growth_velocity / 0.20)
    followers_component = clamp01(follower_count / 1_000_000)
    proximity_component = clamp01(1 - (distance_km / 25.0))

    weighted = (
        0.24 * engagement_component
        + 0.22 * views_component
        + 0.16 * shares_component
        + 0.18 * growth_component
        + 0.12 * followers_component
        + 0.08 * proximity_component
    )
    return round(weighted * 100, 2)


def rising_star_flag(follower_count: int, avg_views: int, growth_velocity: float, engagement_rate: float) -> bool:
    views_ratio = avg_views / max(follower_count, 1)
    return views_ratio >= 4.0 and growth_velocity >= 0.08 and engagement_rate >= 0.07


def pricing_fit_score(creator_followers: int, creator_engagement: float, min_followers: int | None) -> float:
    follower_fit = 1.0 if min_followers is None else clamp01(creator_followers / max(min_followers, 1))
    engagement_fit = clamp01(creator_engagement / 0.12)
    return round((0.65 * follower_fit + 0.35 * engagement_fit) * 100, 2)
