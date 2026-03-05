import React, { useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { colors } from "./src/theme/colors";

type Tab = "Splash" | "Welcome" | "Onboarding" | "Map" | "Viral" | "Radar" | "Ranks" | "Collab" | "Market" | "Analytics" | "Alerts" | "Settings";
const tabs: Tab[] = ["Splash","Welcome","Onboarding","Map","Viral","Radar","Ranks","Collab","Market","Analytics","Alerts","Settings"];
const reels = [
  { id: "r1", title: "Biryani at Paradise Hotel", views: "1.2M", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1200&q=80&auto=format&fit=crop" },
  { id: "r2", title: "Street Food in Charminar", views: "890K", img: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1200&q=80&auto=format&fit=crop" },
  { id: "r3", title: "HIIT Routine at Home", views: "340K", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80&auto=format&fit=crop" },
];
const creators = [
  { id: "c1", name: "Priya Sharma", niche: "Food", km: "2.1", score: 82 },
  { id: "c2", name: "Rahul Kumar", niche: "Fitness", km: "3.8", score: 76 },
  { id: "c3", name: "Ananya M", niche: "Comedy", km: "1.2", score: 74 },
];
const alerts = [
  "Your reel is going viral: 567K views in 24h",
  "Territory unlocked: Food King of Banjara Hills",
  "Collab request from Ravi Sharma",
  "Brand offer: Paradise Hotel INR 8,000",
  "Weekly analytics ready"
];

function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></Pressable>;
}

function Panel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return <View style={styles.panel}><Text style={styles.h2}>{title}</Text>{sub ? <Text style={styles.sub}>{sub}</Text> : null}<View style={{ marginTop: 10 }}>{children}</View></View>;
}

export default function AuraWeb() {
  const [tab, setTab] = useState<Tab>("Map");
  const [msg, setMsg] = useState("Ready");
  const [radius, setRadius] = useState("10km");
  const [cat, setCat] = useState("Food");
  const [zone, setZone] = useState("5 km");
  const [rankCat, setRankCat] = useState("All");
  const [interest, setInterest] = useState<string[]>(["Food", "Comedy", "Travel"]);
  const [read, setRead] = useState<number[]>([]);
  const [onMap, setOnMap] = useState(true);
  const [viral, setViral] = useState(true);
  const [collab, setCollab] = useState(true);
  const [brand, setBrand] = useState(true);

  const body = useMemo(() => {
    if (tab === "Splash") return <Panel title="Splash Screen" sub="Brand identity"><CenterHero onPress={() => setMsg("Splash complete")} /></Panel>;
    if (tab === "Welcome") return <WelcomeBlock onPress={setMsg} />;
    if (tab === "Onboarding") return <OnboardingBlock interest={interest} setInterest={setInterest} onPress={setMsg} />;
    if (tab === "Map") return <MapBlock cat={cat} setCat={setCat} radius={radius} setRadius={setRadius} onPress={setMsg} />;
    if (tab === "Viral") return <ViralBlock zone={zone} setZone={setZone} onPress={setMsg} />;
    if (tab === "Radar") return <RadarBlock onPress={setMsg} />;
    if (tab === "Ranks") return <RanksBlock rankCat={rankCat} setRankCat={setRankCat} onPress={setMsg} />;
    if (tab === "Collab") return <CollabBlock onPress={setMsg} />;
    if (tab === "Market") return <MarketBlock onPress={setMsg} />;
    if (tab === "Analytics") return <AnalyticsBlock onPress={setMsg} />;
    if (tab === "Alerts") return <AlertsBlock read={read} setRead={setRead} onPress={setMsg} />;
    return <SettingsBlock onMap={onMap} setOnMap={setOnMap} viral={viral} setViral={setViral} collab={collab} setCollab={setCollab} brand={brand} setBrand={setBrand} onPress={setMsg} />;
  }, [tab, cat, radius, zone, rankCat, interest, read, onMap, viral, collab, brand]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.glow} />
      <View style={styles.header}><View><Text style={styles.brand}>AURA</Text><Text style={styles.tag}>Influence Mapped</Text></View><View style={{ flexDirection: "row", gap: 8 }}><Pressable style={styles.btnGold} onPress={() => setMsg("Google auth action")}> <Text style={styles.btnGoldText}>🟡 Google</Text></Pressable><Pressable style={styles.btnDark} onPress={() => setMsg("Creator Pro opened")}><Text style={styles.btnDarkText}>✨ Pro</Text></Pressable></View></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 12, paddingVertical: 8 }}>{tabs.map((t) => <Pressable key={t} onPress={() => { setTab(t); setMsg(`${t} opened`); }} style={[styles.tab, tab === t && styles.tabActive]}><Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text></Pressable>)}</ScrollView>
      <View style={styles.status}><Text style={styles.statusText}>Status: {msg}</Text></View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14, paddingBottom: 30 }}>{body}</ScrollView>
    </SafeAreaView>
  );
}

function CenterHero({ onPress }: { onPress: () => void }) {
  return <View style={{ alignItems: "center", gap: 8, paddingVertical: 20 }}><Text style={styles.logo}>AURA</Text><Text style={styles.heroTag}>INFLUENCE MAPPED</Text><Text style={styles.sub}>Warm obsidian + bronze aura rings</Text><Pressable style={styles.btnGold} onPress={onPress}><Text style={styles.btnGoldText}>Continue</Text></Pressable></View>;
}

function WelcomeBlock({ onPress }: { onPress: (m: string) => void }) {
  return <Panel title="Welcome" sub="Zero-friction entry"><View style={{ gap: 8 }}><Pressable style={styles.btnGold} onPress={() => onPress("Google login simulated")}><Text style={styles.btnGoldText}>🟡 Continue with Google</Text></Pressable><Pressable style={styles.btnDark} onPress={() => onPress("Instagram login simulated")}><Text style={styles.btnDarkText}>📷 Continue with Instagram</Text></Pressable><Pressable style={styles.btnDark} onPress={() => onPress("Email login simulated")}><Text style={styles.btnDarkText}>✉ Sign in with Email</Text></Pressable></View></Panel>;
}
function OnboardingBlock({ interest, setInterest, onPress }: { interest: string[]; setInterest: (v: string[]) => void; onPress: (m: string) => void }) {
  const toggle = (x: string) => {
    const next = interest.includes(x) ? interest.filter((i) => i !== x) : [...interest, x];
    setInterest(next);
    onPress(`${x} ${interest.includes(x) ? "removed" : "added"}`);
  };
  return <View style={{ gap: 12 }}>
    <Panel title="Create Account" sub="Step 1 of 3"><View style={{ gap: 8 }}><TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={colors.muted} defaultValue="Arjun Reddy" /><TextInput style={styles.input} placeholder="Username" placeholderTextColor={colors.muted} defaultValue="@arjun_foodie_hyd" /><TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.muted} defaultValue="arjun@gmail.com" /></View></Panel>
    <Panel title="Pick Interests" sub="Step 2 of 3"><View style={styles.wrap}>{["Food", "Fitness", "Comedy", "Fashion", "Travel", "Music", "Photo", "Beauty"].map((i) => <Chip key={i} label={i} active={interest.includes(i)} onPress={() => toggle(i)} />)}</View></Panel>
    <Panel title="Connect Socials" sub="Step 3 of 3"><View style={{ gap: 6 }}><ActionRow left="📷 Instagram" right="Linked" onPress={() => onPress("Instagram connected")} /><ActionRow left="▶ YouTube" right="Connect" onPress={() => onPress("YouTube connect action")} /><ActionRow left="♪ TikTok" right="Connect" onPress={() => onPress("TikTok connect action")} /></View></Panel>
  </View>;
}

function MapBlock({ cat, setCat, radius, setRadius, onPress }: { cat: string; setCat: (v: string) => void; radius: string; setRadius: (v: string) => void; onPress: (m: string) => void }) {
  const [selected, setSelected] = useState("c1");
  const s = creators.find((c) => c.id === selected) || creators[0];
  return <View style={{ gap: 12 }}>
    <Panel title="Live Map Discovery" sub="Creator aura bubbles around your location"><View style={styles.wrap}>{["Food", "Fitness", "Comedy"].map((x) => <Chip key={x} label={x} active={cat === x} onPress={() => { setCat(x); onPress(`Category: ${x}`); }} />)}{["5km", "10km", "25km"].map((x) => <Chip key={x} label={x} active={radius === x} onPress={() => { setRadius(x); onPress(`Radius: ${x}`); }} />)}</View><View style={styles.mapBox}>{creators.map((c, idx) => <Pressable key={c.id} onPress={() => { setSelected(c.id); onPress(`Selected ${c.name}`); }} style={[styles.bubble, { left: 30 + idx * 110, top: 30 + (idx % 2) * 70, width: 85 - idx * 12, height: 85 - idx * 12, opacity: c.id === selected ? 1 : 0.7 }]}><Text style={styles.bubbleText}>{c.name.split(" ").map((n) => n[0]).join("")}</Text></Pressable>)}</View></Panel>
    <Panel title="Creator Quick Card" sub="Tap a bubble to inspect snapshot"><View style={styles.row}><Image source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop" }} style={styles.avatar} /><View style={{ flex: 1 }}><Text style={styles.itemTitle}>{s.name}</Text><Text style={styles.sub}>{s.niche} • {s.km} km away</Text></View><View style={styles.score}><Text style={styles.scoreText}>Aura {s.score}</Text></View></View><Pressable style={styles.btnGold} onPress={() => onPress("Full profile opened")}><Text style={styles.btnGoldText}>View Full Profile</Text></Pressable></Panel>
    <Panel title="Sample Reels" sub="Clickable video snapshots"> <ScrollView horizontal showsHorizontalScrollIndicator={false}>{reels.map((r) => <Pressable key={r.id} onPress={() => onPress(`Opened reel: ${r.title}`)} style={styles.reel}><Image source={{ uri: r.img }} style={styles.reelImg} /><View style={styles.play}><Text style={{ color: "#fff", fontWeight: "900" }}>▶</Text></View><Text style={styles.itemTitle}>{r.title}</Text><Text style={styles.sub}>{r.views} views</Text></Pressable>)}</ScrollView></Panel>
  </View>;
}

function ViralBlock({ zone, setZone, onPress }: { zone: string; setZone: (v: string) => void; onPress: (m: string) => void }) {
  return <Panel title="Viral Near You" sub="Zone filtered live feed"><View style={styles.wrap}>{["5 km", "10 km", "City"].map((z) => <Chip key={z} label={z} active={zone === z} onPress={() => { setZone(z); onPress(`Zone: ${z}`); }} />)}</View>{["Priya Sharma", "Rahul Kumar", "Ananya M", "Vikram Singh"].map((n, i) => <Pressable key={n} onPress={() => onPress(`Opened viral post: ${n}`)} style={[styles.rowCard, i === 0 && styles.hot]}><Text style={styles.itemTitle}>🔥 {n}</Text><Text style={styles.sub}>{["1.2M", "340K", "890K", "500K"][i]} views • {["2.1", "3.8", "1.2", "0.8"][i]} km</Text></Pressable>)}</Panel>;
}

function RadarBlock({ onPress }: { onPress: (m: string) => void }) {
  return <Panel title="Rising Radar" sub="AI pre-viral detection"><View style={{ alignItems: "center", marginBottom: 8 }}><Pressable style={styles.radar} onPress={() => onPress("Radar refreshed")}><View style={styles.radarMid}><View style={styles.radarIn} /></View></Pressable></View>{["Vikram K. • 87x", "Divya P. • 42x", "Sai Kumar • 75x"].map((x) => <Pressable key={x} onPress={() => onPress(`Opened radar creator: ${x}`)} style={styles.rowCard}><Text style={styles.itemTitle}>📡 {x}</Text><Text style={styles.sub}>Nearby rising creator</Text></Pressable>)}</Panel>;
}

function RanksBlock({ rankCat, setRankCat, onPress }: { rankCat: string; setRankCat: (v: string) => void; onPress: (m: string) => void }) {
  return <Panel title="City Leaderboard" sub="Shareable local rank cards"><View style={styles.wrap}>{["All", "Food", "Fitness", "Comedy"].map((c) => <Chip key={c} label={c} active={rankCat === c} onPress={() => { setRankCat(c); onPress(`Rank category: ${c}`); }} />)}</View><View style={styles.row}><Pressable style={styles.rankTop} onPress={() => onPress("Opened #2")}> <Text style={styles.sub}>#2 Rahul</Text><Text style={styles.itemTitle}>32.1K</Text></Pressable><Pressable style={[styles.rankTop, { borderColor: colors.primary }]} onPress={() => onPress("Opened #1")}> <Text style={styles.itemTitle}>👑 #1 Priya</Text><Text style={styles.itemTitle}>48.2K</Text></Pressable><Pressable style={styles.rankTop} onPress={() => onPress("Opened #3")}> <Text style={styles.sub}>#3 Ananya</Text><Text style={styles.itemTitle}>28.4K</Text></Pressable></View><Pressable style={styles.btnGold} onPress={() => onPress("Rank shared")}> <Text style={styles.btnGoldText}>Share My Rank</Text></Pressable></Panel>;
}

function CollabBlock({ onPress }: { onPress: (m: string) => void }) {
  return <Panel title="Collaboration Finder" sub="AI matches by niche and size">{["Ravi Sharma • Match 95%", "Sneha Rao • Match 91%", "Lakshmi P • Match 88%"].map((x, i) => <Pressable key={x} onPress={() => onPress(`Collab clicked: ${x}`)} style={[styles.rowCard, i === 0 && styles.hot]}><Text style={styles.itemTitle}>🤝 {x}</Text><Text style={styles.sub}>Nearby collaborator</Text></Pressable>)}</Panel>;
}

function MarketBlock({ onPress }: { onPress: (m: string) => void }) {
  return <Panel title="Brand Marketplace" sub="Hire local creators">{["Priya Sharma", "Lakshmi P", "Arjun Kaur"].map((x) => <Pressable key={x} onPress={() => onPress(`Brief opened for ${x}`)} style={styles.rowCard}><Text style={styles.itemTitle}>🏷 {x}</Text><Text style={styles.sub}>Rate card + engagement + views</Text></Pressable>)}<Pressable style={styles.btnGold} onPress={() => onPress("Campaign flow opened")}> <Text style={styles.btnGoldText}>Create New Campaign +</Text></Pressable></Panel>;
}

function AnalyticsBlock({ onPress }: { onPress: (m: string) => void }) {
  const [range, setRange] = useState("30D");
  return <Panel title="My Analytics" sub="Growth and Aura Fame Score"><View style={styles.wrap}>{["7D", "30D", "90D"].map((r) => <Chip key={r} label={r} active={range === r} onPress={() => { setRange(r); onPress(`Range: ${r}`); }} />)}</View><View style={styles.row}><Pressable style={styles.scoreRing} onPress={() => onPress("Aura score detail opened")}><Text style={{ color: colors.text, fontSize: 26, fontWeight: "900" }}>74</Text><Text style={styles.sub}>Aura Score</Text></Pressable><View style={{ flex: 1 }}><Text style={styles.good}>You grew faster than 87% this week.</Text><Text style={styles.sub}>Top 12% in Hyderabad</Text></View></View></Panel>;
}
function AlertsBlock({ read, setRead, onPress }: { read: number[]; setRead: (v: number[]) => void; onPress: (m: string) => void }) {
  const mark = (idx: number) => {
    if (!read.includes(idx)) setRead([...read, idx]);
    onPress("Notification opened");
  };
  return <Panel title="Notification Centre" sub="All your alerts">{alerts.map((a, i) => <Pressable key={a} onPress={() => mark(i)} style={[styles.rowCard, !read.includes(i) && styles.hot]}><Text style={styles.itemTitle}>{read.includes(i) ? "✓" : "•"} {a}</Text><Text style={styles.sub}>{i < 2 ? "Today" : "Yesterday"}</Text></Pressable>)}</Panel>;
}

function SettingsBlock({ onMap, setOnMap, viral, setViral, collab, setCollab, brand, setBrand, onPress }: {
  onMap: boolean; setOnMap: (v: boolean) => void; viral: boolean; setViral: (v: boolean) => void; collab: boolean; setCollab: (v: boolean) => void; brand: boolean; setBrand: (v: boolean) => void; onPress: (m: string) => void;
}) {
  return <Panel title="Settings" sub="Privacy, alerts, connected accounts"><View style={styles.rowLine}><Text style={styles.itemTitle}>Show me on map</Text><Switch value={onMap} onValueChange={(v) => { setOnMap(v); onPress(`Show on map ${v ? "On" : "Off"}`); }} /></View><View style={styles.rowLine}><Text style={styles.itemTitle}>Viral alerts</Text><Switch value={viral} onValueChange={(v) => { setViral(v); onPress(`Viral alerts ${v ? "On" : "Off"}`); }} /></View><View style={styles.rowLine}><Text style={styles.itemTitle}>Collab requests</Text><Switch value={collab} onValueChange={(v) => { setCollab(v); onPress(`Collab alerts ${v ? "On" : "Off"}`); }} /></View><View style={styles.rowLine}><Text style={styles.itemTitle}>Brand offers</Text><Switch value={brand} onValueChange={(v) => { setBrand(v); onPress(`Brand alerts ${v ? "On" : "Off"}`); }} /></View><Pressable style={[styles.rowCard, { borderColor: colors.warm }]} onPress={() => onPress("Subscription opened")}> <Text style={styles.itemTitle}>✨ Creator Pro • INR 499 / month</Text><Text style={styles.sub}>Renews 15 March 2026</Text></Pressable></Panel>;
}

function ActionRow({ left, right, onPress }: { left: string; right: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.rowLine}><Text style={styles.itemTitle}>{left}</Text><Text style={right === "Linked" ? styles.good : styles.primary}>{right}</Text></Pressable>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  glow: { position: "absolute", width: 360, height: 360, borderRadius: 180, backgroundColor: "rgba(217,163,79,0.12)", top: -110, right: -120 },
  header: { paddingHorizontal: 18, paddingVertical: 16, backgroundColor: colors.bgSoft, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: colors.primary, fontWeight: "900", fontSize: 30, letterSpacing: 3 },
  tag: { color: colors.text, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2 },
  tabRow: { maxHeight: 46, backgroundColor: colors.bgSoft, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  tabActive: { borderColor: colors.warm, backgroundColor: "rgba(217,163,79,0.2)" },
  tabText: { color: colors.muted, fontWeight: "600", fontSize: 12 },
  tabTextActive: { color: colors.text, fontWeight: "800" },
  status: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.bgSoft, borderBottomWidth: 1, borderBottomColor: colors.border },
  statusText: { color: colors.primary, fontWeight: "700" },
  panel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 18 },
  h2: { color: colors.text, fontSize: 24, fontWeight: "900" },
  sub: { color: colors.muted, marginTop: 4, fontSize: 13, lineHeight: 18 },
  logo: { color: colors.primary, fontWeight: "900", fontSize: 56, letterSpacing: 5 },
  heroTag: { color: colors.text, textTransform: "uppercase", letterSpacing: 1.7, fontWeight: "700" },
  btnGold: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, alignItems: "center" },
  btnGoldText: { color: "#15120d", fontWeight: "900" },
  btnDark: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, alignItems: "center" },
  btnDarkText: { color: colors.text, fontWeight: "700" },
  input: { backgroundColor: colors.bgSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 10, color: colors.text, paddingHorizontal: 12, paddingVertical: 9 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 6, backgroundColor: colors.bgSoft },
  chipActive: { borderColor: colors.warm, backgroundColor: "rgba(217,163,79,0.25)" },
  chipText: { color: colors.muted, fontSize: 12 },
  chipTextActive: { color: colors.text, fontWeight: "700" },
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.warm },
  score: { backgroundColor: "rgba(217,163,79,0.25)", borderWidth: 1, borderColor: colors.warm, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  scoreText: { color: colors.text, fontWeight: "800", fontSize: 12 },
  mapBox: { height: 220, backgroundColor: "#17140f", borderRadius: 12, borderWidth: 1, borderColor: colors.border, position: "relative" },
  bubble: { position: "absolute", borderRadius: 999, backgroundColor: "rgba(217,163,79,0.34)", borderWidth: 1, borderColor: colors.warm, alignItems: "center", justifyContent: "center" },
  bubbleText: { color: colors.text, fontWeight: "800" },
  reel: { width: 220, marginRight: 10, borderRadius: 12, backgroundColor: colors.bgSoft, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  reelImg: { width: "100%", height: 130 },
  play: { position: "absolute", top: 46, left: 88, width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(0,0,0,0.45)", borderWidth: 1, borderColor: "rgba(255,255,255,0.4)", alignItems: "center", justifyContent: "center" },
  itemTitle: { color: colors.text, fontWeight: "700" },
  rowCard: { marginTop: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.bgSoft, padding: 14 },
  hot: { borderColor: colors.warm, backgroundColor: colors.surface2 },
  radar: { width: 150, height: 150, borderRadius: 75, borderWidth: 1, borderColor: "rgba(217,163,79,0.4)", alignItems: "center", justifyContent: "center" },
  radarMid: { width: 102, height: 102, borderRadius: 51, borderWidth: 1, borderColor: "rgba(217,163,79,0.3)", alignItems: "center", justifyContent: "center" },
  radarIn: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: colors.warm, backgroundColor: "rgba(217,163,79,0.25)" },
  rankTop: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.bgSoft, padding: 10 },
  scoreRing: { width: 120, height: 120, borderRadius: 60, borderWidth: 6, borderColor: colors.primary, alignItems: "center", justifyContent: "center", backgroundColor: colors.bgSoft },
  rowLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" },
  good: { color: colors.accent, fontWeight: "700" },
  primary: { color: colors.primary, fontWeight: "700" },
});

