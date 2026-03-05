import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { api } from "../api/client";
import { colors } from "../theme/colors";
import { CreatorCard } from "../types";

export function MapScreen() {
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<CreatorCard[]>([]);

  useEffect(() => {
    api.nearby(17.43, 78.41, 15)
      .then((d) => setCreators(d.creators))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Map Discovery</Text>
      <Text style={styles.sub}>Creator aura bubbles around your current zone</Text>
      <FlatList
        data={creators}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => (
          <View style={[styles.card, index === 0 && styles.hotCard]}>
            <Text style={styles.name}>{item.display_name} (@{item.handle})</Text>
            <Text style={styles.meta}>{item.category} - {item.distance_km} km - Aura Score {item.fame_score}</Text>
            <Text style={styles.zone}>{item.zone}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 14 },
  title: { fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 4 },
  sub: { color: colors.muted, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10 },
  hotCard: { borderColor: colors.warm, backgroundColor: colors.surface2 },
  name: { fontWeight: "700", color: colors.text },
  meta: { marginTop: 4, color: colors.muted },
  zone: { marginTop: 8, color: colors.primary, fontWeight: "700" },
});
