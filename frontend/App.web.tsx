import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { api } from "./src/api/client";
import { AuthProvider, SessionUser } from "./src/auth/auth-context";
import { AdminScreen } from "./src/screens/AdminScreen";
import { CollaborationScreen } from "./src/screens/CollaborationScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { FeedScreen } from "./src/screens/FeedScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { MarketplaceScreen } from "./src/screens/MarketplaceScreen";
import { colors } from "./src/theme/colors";

type TabKey = "Map" | "Feed" | "Dashboard" | "Collab" | "Market" | "Admin";

export default function AppWeb() {
  const [tab, setTab] = useState<TabKey>("Map");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const restore = async () => {
      if (typeof localStorage === "undefined") return;
      const saved = localStorage.getItem("local_fame_token");
      if (!saved) return;
      setAuthLoading(true);
      try {
        const me = await api.me(saved);
        setToken(saved);
        setUser(me);
      } catch {
        localStorage.removeItem("local_fame_token");
      } finally {
        setAuthLoading(false);
      }
    };
    restore();
  }, []);

  const signInAs = async (role: "admin" | "brand") => {
    setAuthLoading(true);
    try {
      const creds = role === "admin"
        ? { email: "admin@localfame.app", password: "admin1234" }
        : { email: "brand@localfame.app", password: "brand1234" };
      const login = await api.login(creds.email, creds.password);
      const me = await api.me(login.access_token);
      setToken(login.access_token);
      setUser(me);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("local_fame_token", login.access_token);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("local_fame_token");
    }
  };

  const Screen = useMemo(() => {
    switch (tab) {
      case "Feed":
        return FeedScreen;
      case "Dashboard":
        return DashboardScreen;
      case "Collab":
        return CollaborationScreen;
      case "Market":
        return MarketplaceScreen;
      case "Admin":
        return AdminScreen;
      default:
        return MapScreen;
    }
  }, [tab]);

  const tabs: TabKey[] = ["Map", "Feed", "Dashboard", "Collab", "Market", "Admin"];

  return (
    <AuthProvider value={{ token, user, loading: authLoading, signInAs, logout }}>
      <SafeAreaView style={styles.root}>
        <View style={styles.authBar}>
          <Text style={styles.authText}>
            {user ? `${user.full_name} (${user.role})` : "Guest"}
          </Text>
          <View style={styles.authActions}>
            <Pressable style={styles.smallBtn} onPress={() => signInAs("brand")}>
              <Text style={styles.smallBtnText}>Brand</Text>
            </Pressable>
            <Pressable style={styles.smallBtn} onPress={() => signInAs("admin")}>
              <Text style={styles.smallBtnText}>Admin</Text>
            </Pressable>
            <Pressable style={styles.smallBtnGhost} onPress={logout}>
              <Text style={styles.smallBtnGhostText}>Logout</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>{authLoading ? <ActivityIndicator style={{ marginTop: 20 }} /> : <Screen />}</View>

        <View style={styles.tabBar}>
          {tabs.map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  authBar: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authText: { color: colors.text, fontWeight: "700" },
  authActions: { flexDirection: "row", gap: 8 },
  smallBtn: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  smallBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  smallBtnGhost: { borderColor: colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  smallBtnGhostText: { color: colors.text, fontWeight: "700", fontSize: 12 },
  content: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#eaf1ff" },
  tabText: { color: colors.muted, fontWeight: "600", fontSize: 12 },
  tabTextActive: { color: colors.primary },
});
