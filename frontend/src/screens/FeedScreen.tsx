import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { api } from '../api/client';
import { colors } from '../theme/colors';

export function FeedScreen() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<{ creator_id: string; creator_name: string; handle: string; title: string; views: number; distance_km: number }[]>([]);

  useEffect(() => {
    api.viralFeed(17.43, 78.41, 10)
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Viral Near You</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.creator_id + i.title}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.head}>{item.creator_name} (@{item.handle})</Text>
            <Text style={styles.meta}>{item.title}</Text>
            <Text style={styles.stat}>{item.views.toLocaleString()} views • {item.distance_km} km away</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 14 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 14, borderColor: colors.border, borderWidth: 1, padding: 14, marginBottom: 10 },
  head: { fontWeight: '700', color: colors.text },
  meta: { marginTop: 6, color: colors.muted },
  stat: { marginTop: 8, color: colors.warm, fontWeight: '700' }
});
