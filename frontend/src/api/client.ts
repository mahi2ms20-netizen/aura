import { NearbyResponse } from "../types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getJson<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

async function postJson<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    postJson<{ access_token: string; token_type: string }>("/auth/login", { email, password }),

  me: (token: string) =>
    getJson<{ id: string; email: string; full_name: string; role: string; city?: string }>("/auth/me", token),

  nearby: (lat: number, lng: number, radiusKm = 10) =>
    getJson<NearbyResponse>(`/discover/nearby?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`),

  risingStars: (lat: number, lng: number, radiusKm = 10) =>
    getJson<NearbyResponse>(`/discover/rising-stars?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`),

  famousNearMe: (lat: number, lng: number, radiusKm = 5) =>
    getJson<NearbyResponse>(`/discover/famous-near-me?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`),

  heatmap: (city: string) =>
    getJson<{ city: string; points: { lat: number; lng: number; intensity: number; category: string }[] }>(
      `/map/heatmap?city=${city}`
    ),

  viralFeed: (lat: number, lng: number, radiusKm = 10) =>
    getJson<{ items: { creator_id: string; creator_name: string; handle: string; title: string; views: number; distance_km: number }[] }>(
      `/feed/viral-near-you?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`
    ),

  dashboard: (creatorId: string, lat: number, lng: number) =>
    getJson<any>(`/creators/${creatorId}/dashboard?lat=${lat}&lng=${lng}`),

  collabSearch: (creatorId: string, radiusKm = 10) =>
    getJson<{ results: NearbyResponse["creators"] }>(`/collab/search?creator_id=${creatorId}&radius_km=${radiusKm}`),

  createCampaign: (payload: any, token: string) =>
    postJson<{ id: string; status: string }>("/brands/campaigns", payload, token),

  campaignMatches: (campaignId: string, lat: number, lng: number, token: string) =>
    getJson<{ campaign_id: string; matches: any[] }>(`/brands/campaigns/${campaignId}/matches?lat=${lat}&lng=${lng}`, token),

  queueDailyNotify: (city: string, token: string) =>
    postJson<{ job_id: string; status: string; city: string }>(`/scores/notify/daily?city=${encodeURIComponent(city)}`, {}, token),

  recomputeScore: (creatorId: string, token: string) =>
    postJson<{ job_id: string; status: string }>(`/scores/recompute/${creatorId}`, {}, token),
};
