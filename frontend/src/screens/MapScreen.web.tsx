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

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Influencer Map (Web List Mode)</Text>
      <FlatList
        data={creators}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.display_name} (@{item.handle})</Text>
            <Text style={styles.meta}>{item.category} • {item.distance_km} km • Fame {item.fame_score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 14 },
  title: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  name: { fontWeight: "700", color: colors.text },
  meta: { marginTop: 4, color: colors.muted }
});
