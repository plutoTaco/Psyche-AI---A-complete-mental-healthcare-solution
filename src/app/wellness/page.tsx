"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

type BreathingPattern = { name: string; inhale: number; hold: number; exhale: number; holdAfter: number; description: string };

const BREATHING_PATTERNS: BreathingPattern[] = [
  { name: "4-7-8 Relaxing", inhale: 4, hold: 7, exhale: 8, holdAfter: 0, description: "A calming technique to reduce anxiety and help you fall asleep." },
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, holdAfter: 4, description: "Used by Navy SEALs to stay calm under pressure." },
  { name: "Simple Calm", inhale: 4, hold: 0, exhale: 6, holdAfter: 0, description: "Extended exhale activates your parasympathetic nervous system." },
];

const GROUNDING_SENSES = [
  { number: 5, sense: "See", icon: "visibility", prompt: "Name 5 things you can see right now" },
  { number: 4, sense: "Touch", icon: "touch_app", prompt: "Name 4 things you can physically feel" },
  { number: 3, sense: "Hear", icon: "hearing", prompt: "Name 3 things you can hear" },
  { number: 2, sense: "Smell", icon: "air", prompt: "Name 2 things you can smell" },
  { number: 1, sense: "Taste", icon: "restaurant", prompt: "Name 1 thing you can taste" },
];

const RESOURCES = [
  { title: "Understanding Anxiety", desc: "Learn about the causes, symptoms, and evidence-based coping strategies.", icon: "psychology", category: "Article" },
  { title: "Mindful Eating Guide", desc: "How to use meals as a mindfulness practice for emotional wellbeing.", icon: "restaurant", category: "Guide" },
  { title: "Sleep Hygiene 101", desc: "Build a bedtime routine that helps you fall asleep faster and stay asleep.", icon: "bedtime", category: "Article" },
  { title: "Coping with Grief", desc: "Navigating loss and finding meaning through the healing process.", icon: "favorite", category: "Guide" },
];

export default function WellnessPage() {
  const [activeTab, setActiveTab] = useState<"breathing" | "grounding" | "meditation" | "resources">("breathing");
  const [selectedPattern, setSelectedPattern] = useState(BREATHING_PATTERNS[0]);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Ready");
  const [circleScale, setCircleScale] = useState(1);
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingStarted, setGroundingStarted] = useState(false);
  const [meditationTime, setMeditationTime] = useState(300);
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationRemaining, setMeditationRemaining] = useState(300);

  // Breathing exercise logic
  const runBreathingCycle = useCallback(async () => {
    const p = selectedPattern;
    const phases: [string, number, number][] = [
      ["Breathe In", p.inhale, 1.5],
      ...(p.hold > 0 ? [["Hold", p.hold, 1.5] as [string, number, number]] : []),
      ["Breathe Out", p.exhale, 1],
      ...(p.holdAfter > 0 ? [["Hold", p.holdAfter, 1] as [string, number, number]] : []),
    ];

    for (const [label, duration, scale] of phases) {
      setBreathPhase(label);
      setCircleScale(scale);
      await new Promise((r) => setTimeout(r, duration * 1000));
    }
  }, [selectedPattern]);

  useEffect(() => {
    if (!breathingActive) return;
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) { await runBreathingCycle(); }
    };
    loop();
    return () => { cancelled = true; };
  }, [breathingActive, runBreathingCycle]);

  // Meditation timer
  useEffect(() => {
    if (!meditationActive) return;
    const interval = setInterval(() => {
      setMeditationRemaining((t) => {
        if (t <= 1) { setMeditationActive(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [meditationActive]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const tabs = [
    { id: "breathing" as const, label: "Breathing", icon: "air" },
    { id: "grounding" as const, label: "Grounding", icon: "self_improvement" },
    { id: "meditation" as const, label: "Meditation", icon: "timer" },
    { id: "resources" as const, label: "Resources", icon: "library_books" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>Wellness Hub</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
          Interactive tools to help you find calm, stay grounded, and build resilience.
        </p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 40, background: "#fff", padding: 6, borderRadius: "var(--radius-full)", border: "1px solid var(--border-color)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px", borderRadius: "var(--radius-full)",
              background: activeTab === tab.id ? "var(--primary)" : "transparent",
              color: activeTab === tab.id ? "#fff" : "var(--text-secondary)",
              fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Breathing ─── */}
      {activeTab === "breathing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
          {/* Pattern selector */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
            {BREATHING_PATTERNS.map((p) => (
              <button
                key={p.name}
                onClick={() => { setSelectedPattern(p); setBreathingActive(false); setBreathPhase("Ready"); setCircleScale(1); }}
                style={{
                  padding: "12px 24px", borderRadius: "var(--radius-full)",
                  border: `2px solid ${selectedPattern.name === p.name ? "var(--primary)" : "var(--border-color)"}`,
                  background: selectedPattern.name === p.name ? "rgba(236,91,19,0.08)" : "#fff",
                  fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  color: selectedPattern.name === p.name ? "var(--primary)" : "var(--text-secondary)",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          <p style={{ color: "var(--text-secondary)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
            {selectedPattern.description}
          </p>

          {/* Breathing circle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <div
              style={{
                width: 240, height: 240, borderRadius: "50%",
                background: `radial-gradient(circle, rgba(236,91,19,0.15), rgba(236,91,19,0.05))`,
                border: "3px solid var(--primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transform: `scale(${circleScale})`,
                transition: `transform ${breathPhase === "Breathe In" ? selectedPattern.inhale : breathPhase === "Breathe Out" ? selectedPattern.exhale : 0.3}s ease-in-out`,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: "var(--primary)", marginBottom: 4 }}>
                  {breathPhase}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>
                  {breathingActive ? "Follow the circle" : "Press start"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setBreathingActive(!breathingActive); if (breathingActive) { setBreathPhase("Ready"); setCircleScale(1); } }}
            style={{
              padding: "16px 48px", borderRadius: "var(--radius-full)",
              background: breathingActive ? "var(--text-primary)" : "var(--primary)",
              color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "inherit",
              boxShadow: breathingActive ? "none" : "0 8px 24px var(--shadow-primary)", transition: "all 0.3s",
            }}
          >
            {breathingActive ? "Stop" : "Start Breathing"}
          </button>
        </motion.div>
      )}

      {/* ─── Grounding ─── */}
      {activeTab === "grounding" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>5-4-3-2-1 Grounding</h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              This technique helps you reconnect with the present moment by engaging all five senses.
            </p>
          </div>

          {!groundingStarted ? (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setGroundingStarted(true)}
                style={{
                  padding: "16px 48px", borderRadius: "var(--radius-full)", background: "var(--primary)",
                  color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 8px 24px var(--shadow-primary)",
                }}
              >
                Begin Exercise
              </button>
            </div>
          ) : (
            <div style={{ maxWidth: 500, margin: "0 auto" }}>
              {GROUNDING_SENSES.map((sense, i) => (
                <motion.div
                  key={sense.sense}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: i <= groundingStep ? 1 : 0.3, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: 24, borderRadius: "var(--radius)", marginBottom: 16,
                    background: i === groundingStep ? "rgba(236,91,19,0.08)" : "#fff",
                    border: `2px solid ${i === groundingStep ? "var(--primary)" : i < groundingStep ? "#22c55e" : "var(--border-color)"}`,
                    display: "flex", alignItems: "center", gap: 16, cursor: i === groundingStep ? "pointer" : "default",
                    transition: "all 0.3s",
                  }}
                  onClick={() => { if (i === groundingStep && groundingStep < 4) setGroundingStep(groundingStep + 1); }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: i < groundingStep ? "#dcfce7" : i === groundingStep ? "rgba(236,91,19,0.1)" : "rgba(0,0,0,0.03)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: i < groundingStep ? "#16a34a" : i === groundingStep ? "var(--primary)" : "var(--text-secondary)",
                  }}>
                    <span className="material-symbols-outlined">
                      {i < groundingStep ? "check" : sense.icon}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>
                      {sense.number} — {sense.sense}
                    </p>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{sense.prompt}</p>
                  </div>
                  {i === groundingStep && (
                    <span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 700 }}>TAP WHEN DONE</span>
                  )}
                </motion.div>
              ))}

              {groundingStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ textAlign: "center", padding: 32, background: "#dcfce7", borderRadius: "var(--radius)", marginTop: 24 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#16a34a", marginBottom: 8 }}>check_circle</span>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>You did it!</h3>
                  <p style={{ color: "#166534" }}>Take a deep breath. You&apos;re grounded in the present moment.</p>
                  <button
                    onClick={() => { setGroundingStep(0); setGroundingStarted(false); }}
                    style={{ marginTop: 16, padding: "10px 24px", borderRadius: "var(--radius-full)", background: "#16a34a", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Do It Again
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ─── Meditation ─── */}
      {activeTab === "meditation" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Meditation Timer</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 40 }}>
            Set your timer and find stillness. Close your eyes and focus on your breath.
          </p>

          {/* Timer display */}
          <div style={{
            width: 240, height: 240, borderRadius: "50%", margin: "0 auto 32px",
            background: "linear-gradient(135deg, rgba(236,91,19,0.08), rgba(236,91,19,0.03))",
            border: "3px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <p style={{ fontSize: 48, fontWeight: 900, color: "var(--primary)", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(meditationActive ? meditationRemaining : meditationTime)}
            </p>
          </div>

          {/* Duration selector */}
          {!meditationActive && (
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32 }}>
              {[120, 300, 600, 900, 1200].map((secs) => (
                <button
                  key={secs}
                  onClick={() => { setMeditationTime(secs); setMeditationRemaining(secs); }}
                  style={{
                    padding: "10px 20px", borderRadius: "var(--radius-full)",
                    border: `2px solid ${meditationTime === secs ? "var(--primary)" : "var(--border-color)"}`,
                    background: meditationTime === secs ? "rgba(236,91,19,0.08)" : "#fff",
                    fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                    color: meditationTime === secs ? "var(--primary)" : "var(--text-secondary)",
                  }}
                >
                  {secs / 60}m
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              if (meditationActive) { setMeditationActive(false); }
              else { setMeditationRemaining(meditationTime); setMeditationActive(true); }
            }}
            style={{
              padding: "16px 48px", borderRadius: "var(--radius-full)",
              background: meditationActive ? "var(--text-primary)" : "var(--primary)",
              color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "inherit",
              boxShadow: meditationActive ? "none" : "0 8px 24px var(--shadow-primary)",
            }}
          >
            {meditationActive ? "Stop" : "Start Meditation"}
          </button>
        </motion.div>
      )}

      {/* ─── Resources ─── */}
      {activeTab === "resources" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Resource Library</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Curated articles and guides to support your wellness journey.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {RESOURCES.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: 24, borderRadius: "var(--radius)", background: "#fff",
                  border: "1px solid var(--border-color)", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(236,91,19,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
                    <span className="material-symbols-outlined">{r.icon}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.category}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, marginTop: 2 }}>{r.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{r.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
