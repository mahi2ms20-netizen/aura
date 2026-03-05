import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { CreatorCard } from "../types";

export function CreatorTile({ creator }: { creator: CreatorCard }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{creator.display_name}</Text>
        <Text style={styles.score}>{creator.fame_score}</Text>
      </View>
      <Text style={styles.meta}>@{creator.handle} - {creator.category} - {creator.distance_km} km</Text>
      <Text style={styles.meta}>{Math.round(creator.engagement_rate * 100)}% ER - {creator.follower_count.toLocaleString()} followers</Text>
      {creator.rising_star ? <Text style={styles.badge}>Rising Creator Near You</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  score: {
    color: colors.primary,
    fontWeight: "800",
  },
  meta: {
    marginTop: 4,
    color: colors.muted,
  },
  badge: {
    marginTop: 8,
    color: colors.accent,
    fontWeight: "700",
  },
});
