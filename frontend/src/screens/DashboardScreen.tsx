import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { api } from '../api/client';
import { colors } from '../theme/colors';

export function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    api.nearby(17.43, 78.41, 10)
      .then((d) => d.creators[0])
      .then((creator) => api.dashboard(creator.id, 17.43, 78.41))
      .then((d) => setDashboard(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!dashboard) return <Text>No creator found.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{dashboard.creator.display_name}</Text>
      <Text style={styles.sub}>@{dashboard.creator.handle} • {dashboard.creator.category}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Fame Score</Text>
        <Text style={styles.value}>{dashboard.creator.fame_score}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Latest Viral Reel</Text>
        <Text style={styles.valueSm}>{dashboard.latest_viral_reel.title}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Most Viewed Reel</Text>
        <Text style={styles.valueSm}>{dashboard.most_viewed_reel.views.toLocaleString()} views</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Most Liked Post</Text>
        <Text style={styles.valueSm}>{dashboard.most_liked_post.title}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Growth Trend</Text>
        <Text style={styles.valueSm}>{Math.round(dashboard.growth_trend * 100)}% velocity</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 14 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  sub: { marginTop: 4, marginBottom: 12, color: colors.muted },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10 },
  label: { color: colors.muted, fontWeight: '600' },
  value: { marginTop: 6, fontSize: 28, fontWeight: '800', color: colors.primary },
  valueSm: { marginTop: 6, fontSize: 16, fontWeight: '700', color: colors.text }
});
