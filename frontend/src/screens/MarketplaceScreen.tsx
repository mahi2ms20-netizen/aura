import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { api } from "../api/client";
import { useAuth } from "../auth/auth-context";
import { colors } from "../theme/colors";

export function MarketplaceScreen() {
  const { token, user, signInAs } = useAuth();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const ensureBrandToken = async (): Promise<string> => {
    if (token && (user?.role === "brand" || user?.role === "admin")) {
      return token;
    }
    await signInAs("brand");
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem("local_fame_token") : null;
    if (!stored) throw new Error("Brand login required");
    return stored;
  };

  const runMatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeToken = await ensureBrandToken();
      const me = await api.me(activeToken);
      const campaign = await api.createCampaign(
        {
          brand_user_id: me.id,
          title: "Restaurant Launch Push",
          objective: "Drive local footfall",
          category: "food",
          city: "Hyderabad",
          radius_km: 12,
          min_followers: 10000,
          budget_inr: 150000,
        },
        activeToken
      );

      const res = await api.campaignMatches(campaign.id, 17.43, 78.41, activeToken);
      setMatches(res.matches);
    } catch (e: any) {
      setMatches([]);
      setError(e?.message || "Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runMatch();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brand Marketplace</Text>
      <Pressable style={styles.btn} onPress={runMatch}>
        <Text style={styles.btnText}>Refresh Matches</Text>
      </Pressable>
      {loading ? <ActivityIndicator style={{ marginBottom: 12 }} /> : null}
      {error ? <Text style={styles.err}>{error}</Text> : null}
      <FlatList
        data={matches}
        keyExtractor={(i) => i.creator_id}
        ListEmptyComponent={!loading ? <Text style={styles.meta}>No matches yet.</Text> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.display_name} (@{item.handle})
            </Text>
            <Text style={styles.meta}>
              {item.follower_count.toLocaleString()} followers - {Math.round(item.engagement_rate * 100)}% ER
            </Text>
            <Text style={styles.score}>Match Score {item.match_score} - INR {item.pricing_estimate_inr}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 14 },
  title: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: 12 },
  btn: { backgroundColor: colors.primary, borderRadius: 10, padding: 12, alignItems: "center", marginBottom: 12 },
  btnText: { color: "#fff", fontWeight: "700" },
  err: { color: "#b42318", marginBottom: 10 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10 },
  name: { fontWeight: "700", color: colors.text },
  meta: { marginTop: 6, color: colors.muted },
  score: { marginTop: 8, color: colors.accent, fontWeight: "700" },
});

