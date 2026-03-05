import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { api } from '../api/client';
import { colors } from '../theme/colors';
import { CreatorCard } from '../types';

let NativeMapView: any = null;
let NativeMarker: any = null;
let NativeCircle: any = null;

if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  NativeMapView = maps.default;
  NativeMarker = maps.Marker;
  NativeCircle = maps.Circle;
}

export function MapScreen() {
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<CreatorCard[]>([]);
  const [region] = useState({ latitude: 17.43, longitude: 78.41, latitudeDelta: 0.08, longitudeDelta: 0.08 });

  useEffect(() => {
    api.nearby(region.latitude, region.longitude, 15)
      .then((d) => setCreators(d.creators))
      .finally(() => setLoading(false));
  }, [region.latitude, region.longitude]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Influencer Heat Map (Web)</Text>
        <View style={styles.webMap}>
          {creators.map((c) => (
            <Text key={c.id} style={styles.webItem}>
              {c.display_name} • {c.category} • Fame {c.fame_score}
            </Text>
          ))}
        </View>
        <Text style={styles.caption}>Web fallback view. Use mobile build for interactive map.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Influencer Heat Map</Text>
      <NativeMapView style={styles.map} initialRegion={region}>
        <NativeCircle
          center={{ latitude: region.latitude, longitude: region.longitude }}
          radius={5000}
          fillColor="rgba(11,110,246,0.08)"
          strokeColor="rgba(11,110,246,0.4)"
        />
        {creators.map((c) => (
          <NativeMarker
            key={c.id}
            coordinate={{ latitude: c.lat, longitude: c.lng }}
            title={c.display_name}
            description={`${c.category} • Fame ${c.fame_score}`}
          />
        ))}
      </NativeMapView>
      <Text style={styles.caption}>Bubbles are sized by fame score in production tile rendering.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 16 },
  title: { paddingHorizontal: 16, fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 10 },
  map: { flex: 1 },
  webMap: {
    backgroundColor: colors
