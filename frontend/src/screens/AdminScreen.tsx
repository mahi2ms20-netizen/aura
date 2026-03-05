import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../auth/auth-context";
import { api } from "../api/client";
import { colors } from "../theme/colors";

export function AdminScreen() {
  const { token, user, signInAs } = useAuth();
  const [msg, setMsg] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const ensureAdmin = async (): Promise<string> => {
    if (token && user?.role === "admin") return token;
    await signInAs("admin");
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem("local_fame_token") : null;
    if (!stored) throw new Error("Admin login required");
    return stored;
  };

  const queueDaily = async () => {
    setBusy(true);
    setMsg("");
    try {
      const adminToken = await ensureAdmin();
      const res = await api.queueDailyNotify("Hyderabad", adminToken);
      setMsg(`Queued daily notification job: ${res.job_id}`);
    } catch (e: any) {
      setMsg(e?.message || "Failed to queue daily notification job");
    } finally {
      setBusy(false);
    }
  };

  const recomputeFirst = async () => {
    setBusy(true);
    setMsg("");
    try {
      const adminToken = await ensureAdmin();
      const nearby = await api.nearby(17.43, 78.41, 10);
      if (!nearby.creators.length) {
        setMsg("No creators found for recompute.");
        return;
      }
      const res = await api.recomputeScore(nearby.creators[0].id, adminToken);
      setMsg(`Queued recompute job: ${res.job_id}`);
    } catch (e: any) {
      setMsg(e?.message || "Failed to queue recompute job");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Controls</Text>
      <Text style={styles.meta}>Use this tab to trigger async platform jobs.</Text>
      <Pressable style={styles.btn} onPress={queueDaily} disabled={busy}>
        <Text style={styles.btnText}>Queue Daily Viral Notification</Text>
      </Pressable>
      <Pressable style={styles.btnAlt} onPress={recomputeFirst} disabled={busy}>
        <Text style={styles.btnAltText}>Queue Fame Recompute (Nearest Creator)</Text>
      </Pressable>
      {msg ? <Text style={styles.msg}>{msg}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 14 },
  title: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: 8 },
  meta: { color: colors.muted, marginBottom: 12 },
  btn: { backgroundColor: colors.primary, borderRadius: 10, padding: 12, marginBottom: 10 },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  btnAlt: { backgroundColor: "#fff", borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 12 },
  btnAltText: { color: colors.text, fontWeight: "700", textAlign: "center" },
  msg: { marginTop: 12, color: colors.accent, fontWeight: "700" },
});
