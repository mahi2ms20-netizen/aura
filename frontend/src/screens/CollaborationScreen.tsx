import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { api } from '../api/client';
import { CreatorTile } from '../components/CreatorTile';
import { colors } from '../theme/colors';
import { CreatorCard } from '../types';

export function CollaborationScreen() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<CreatorCard[]>([]);

  useEffect(() => {
    api.nearby(17.43, 78.41, 10)
      .then((d) => d.creators[0])
      .then((me) => api.collabSearch(me.id, 12))
      .then((d) => setResults(d.results))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Collaboration Engine</Text>
      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <CreatorTile creator={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 14 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 12 }
});
