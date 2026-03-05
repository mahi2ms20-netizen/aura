export type CreatorCard = {
  id: string;
  handle: string;
  display_name: string;
  category: string;
  city: string;
  area: string;
  lat: number;
  lng: number;
  distance_km: number;
  follower_count: number;
  engagement_rate: number;
  fame_score: number;
  rising_star: boolean;
  zone: string;
};

export type NearbyResponse = {
  radius_km: number;
  total: number;
  creators: CreatorCard[];
};
