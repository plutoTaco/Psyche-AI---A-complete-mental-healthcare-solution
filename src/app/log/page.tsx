"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  text: string;
  prompt: string;
}

const MOODS = [
  { emoji: "😔", label: "Very Low", value: 1, color: "#ef4444" },
  { emoji: "😟", label: "Low", value: 2, color: "#f97316" },
  { emoji: "😐", label: "Neutral", value: 3, color: "#eab308" },
  { emoji: "🙂", label: "Good", value: 4, color: "#22c55e" },
  { emoji: "😊", label: "Great", value: 5, color: "#10b981" },
];

const PROMPTS = [
  "What are three things you're grateful for today?",
  "Describe a moment today that made you smile.",
  "What's one thing you'd like to let go of?",
  "How did you take care of yourself today?",
  "What's something you're looking forward to?",
  "Write about a challenge you overcame recently.",
  "What would you tell a friend who feels the way you do?",
];

export default function LogPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([
    { id: "1", date: "2025-03-25", mood: 4, text: "Had a productive day at work. Felt confident during the presentation.", prompt: "What are three things you're grateful for today?" },
    { id: "2", date: "2025-03-24", mood: 3, text: "Mixed feelings today. The morning was rough but the evening walk helped.", prompt: "How did you take care of yourself today?" },
    { id: "3", date: "2025-03-23", mood: 5, text: "Amazing day! Connected with old friends and felt truly happy.", prompt: "Describe a moment today that made you smile." },
    { id: "4", date: "2025-03-22", mood: 2, text: "Struggled with anxiety. Breathing exercises helped somewhat.", prompt: "What would you tell a friend who feels the way you do?" },
    { id: "5", date: "2025-03-21", mood: 4, text: "Good workout this morning. Feeling energized and positive.", prompt: "How did you take care of yourself today?" },
    { id: "6", date: "2025-03-20", mood: 3, text: "Average day. Nothing special but nothing bad either.", prompt: "What's something you're looking forward to?" },
    { id: "7", date: "2025-03-19", mood: 4, text: "Made progress on a personal goal. Feeling accomplished.", prompt: "What are three things you're grateful for today?" },
  ]);

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalText, setJournalText] = useState("");
  const [currentPrompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [view, setView] = useState<"7" | "30">("7");

  const streak = entries.length;
  const avgMood = (entries.reduce((s, e) => s + e.mood, 0) / entries.length).toFixed(1);

  const addEntry = () => {
    if (selectedMood === null || !journalText.trim()) return;
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      mood: selectedMood,
      text: journalText.trim(),
      prompt: currentPrompt,
    };
    setEntries((prev) => [newEntry, ...prev]);
    setSelectedMood(null);
    setJournalText("");
  };

  // Generate SVG path for mood chart
  const chartEntries = entries.slice(0, view === "7" ? 7 : 30).reverse();
  const chartWidth = 400;
  const chartHeight = 100;
  const points = chartEntries.map((e, i) => ({
    x: (i / Math.max(chartEntries.length - 1, 1)) * chartWidth,
    y: chartHeight - ((e.mood - 1) / 4) * (chartHeight - 20) - 10,
  }));
  const pathD = points.length > 1
    ? `M${points.map((p) => `${p.x},${p.y}`).join(" L")}`
    : "";
  const areaD = pathD ? `${pathD} V${chartHeight} H0 Z` : "";

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "280px 1fr 320px", gap: 32 }}>
      {/* ─── Left: Calendar / Past Entries ─── */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Entries</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {entries.slice(0, 10).map((entry) => {
            const mood = MOODS.find((m) => m.value === entry.mood)!;
            return (
              <div
                key={entry.id}
                style={{
                  padding: "14px 16px",
                  borderRadius: "var(--radius)",
                  background: "#fff",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                    {new Date(entry.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  <span style={{ fontSize: 20 }}>{mood.emoji}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {entry.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Center: Journal Input ─── */}
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>
            Daily Thoughts Log
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
            Take a moment to check in with yourself. Your entries are private and encrypted.
          </p>

          {/* AI Prompt Card */}
          <div
            style={{
              padding: 20,
              borderRadius: "var(--radius)",
              background: "linear-gradient(135deg, rgba(236,91,19,0.08), rgba(236,91,19,0.03))",
              border: "1px solid rgba(236,91,19,0.15)",
              marginBottom: 24,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: 22, marginTop: 2 }}>
              lightbulb
            </span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                Today&apos;s Journal Prompt
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                {currentPrompt}
              </p>
            </div>
          </div>

          {/* Mood Selector */}
          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>How are you feeling?</p>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                style={{
                  flex: 1,
                  padding: "16px 8px",
                  borderRadius: "var(--radius)",
                  border: `2px solid ${selectedMood === mood.value ? mood.color : "var(--border-color)"}`,
                  background: selectedMood === mood.value ? `${mood.color}15` : "#fff",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 28 }}>{mood.emoji}</span>
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginTop: 4 }}>
                  {mood.label}
                </p>
              </button>
            ))}
          </div>

          {/* Text Area */}
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="What's on your mind today? Write freely..."
            rows={8}
            style={{
              width: "100%",
              padding: 20,
              borderRadius: "var(--radius)",
              border: "1px solid var(--border-color)",
              fontFamily: "inherit",
              fontSize: 15,
              lineHeight: 1.7,
              resize: "vertical",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
          />

          <button
            onClick={addEntry}
            disabled={selectedMood === null || !journalText.trim()}
            style={{
              width: "100%",
              marginTop: 16,
              padding: 18,
              borderRadius: "var(--radius)",
              background: selectedMood !== null && journalText.trim() ? "var(--primary)" : "rgba(0,0,0,0.05)",
              color: selectedMood !== null && journalText.trim() ? "#fff" : "var(--text-secondary)",
              fontSize: 16,
              fontWeight: 700,
              border: "none",
              cursor: selectedMood !== null && journalText.trim() ? "pointer" : "default",
              fontFamily: "inherit",
              transition: "all 0.2s",
              boxShadow: selectedMood !== null && journalText.trim() ? "0 8px 24px var(--shadow-primary)" : "none",
            }}
          >
            Save Today&apos;s Entry
          </button>
        </motion.div>
      </div>

      {/* ─── Right: Analytics ─── */}
      <div>
        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div style={{ padding: 20, borderRadius: "var(--radius)", background: "#fff", border: "1px solid var(--border-color)", textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)" }}>{streak}</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>Day Streak 🔥</p>
          </div>
          <div style={{ padding: 20, borderRadius: "var(--radius)", background: "#fff", border: "1px solid var(--border-color)", textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#22c55e" }}>{avgMood}</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>Avg Mood</p>
          </div>
        </div>

        {/* Mood Chart */}
        <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius)", padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h4 style={{ fontWeight: 700, fontSize: 15 }}>Mood Trend</h4>
            <div style={{ display: "flex", gap: 4 }}>
              {(["7", "30"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    background: view === v ? "var(--primary)" : "transparent",
                    color: view === v ? "#fff" : "var(--text-secondary)",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {v}D
                </button>
              ))}
            </div>
          </div>

          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: "100%", height: 120 }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="logGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#ec5b13", stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: "#ec5b13", stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            {areaD && <path d={areaD} fill="url(#logGrad)" />}
            {pathD && <path d={pathD} fill="none" stroke="#ec5b13" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="5" fill="#ec5b13" stroke="#fff" strokeWidth="2" />
            ))}
          </svg>
        </div>

        {/* Mood Distribution */}
        <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius)", padding: 20 }}>
          <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Mood Distribution</h4>
          {MOODS.map((mood) => {
            const count = entries.filter((e) => e.mood === mood.value).length;
            const pct = entries.length > 0 ? (count / entries.length) * 100 : 0;
            return (
              <div key={mood.value} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 18, width: 28 }}>{mood.emoji}</span>
                <div style={{ flex: 1, height: 8, borderRadius: "var(--radius-full)", background: "rgba(0,0,0,0.05)", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    style={{ height: "100%", borderRadius: "var(--radius-full)", background: mood.color }}
                  />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", width: 28, textAlign: "right" }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
