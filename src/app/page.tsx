"use client";
import { motion, type Variants, type Easing } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as Easing } }),
};

export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ─── Hero ─── */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px",
          display: "flex",
          alignItems: "center",
          gap: 60,
        }}
      >
        <motion.div style={{ flex: 1 }} initial="hidden" animate="visible">
          <motion.div
            custom={0}
            variants={fadeUp}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(236,91,19,0.1)",
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              color: "var(--primary)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 24,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              verified_user
            </span>
            Compassionate AI Support
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              marginBottom: 24,
            }}
          >
            Human-Centered{" "}
            <span style={{ color: "var(--primary)" }}>AI Therapy</span>, Whenever You Need It.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              maxWidth: 520,
              marginBottom: 36,
            }}
          >
            Your personal AI-driven mental health care assistant hub, providing immediate support,
            guided meditations, and seamless psychiatric connections.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} style={{ display: "flex", gap: 16 }}>
            <a
              href="/chat"
              style={{
                background: "var(--primary)",
                color: "#fff",
                padding: "18px 40px",
                borderRadius: "var(--radius-full)",
                fontSize: 17,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 12px 32px var(--shadow-primary)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Start Chatting Now
            </a>
            <a
              href="#features"
              style={{
                border: "2px solid rgba(236,91,19,0.2)",
                color: "var(--primary)",
                padding: "18px 40px",
                borderRadius: "var(--radius-full)",
                fontSize: 17,
                fontWeight: 700,
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(236,91,19,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              How It Works
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ flex: 1, position: "relative" }}
        >
          <div
            style={{
              aspectRatio: "1",
              borderRadius: "var(--radius)",
              background: "rgba(236,91,19,0.05)",
              padding: 16,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "var(--radius)",
                background:
                  "linear-gradient(135deg, rgba(236,91,19,0.15), rgba(236,91,19,0.05))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 140, color: "var(--primary)", opacity: 0.3 }}
              >
                self_improvement
              </span>
            </div>
          </div>

          {/* Floating mood widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              position: "absolute",
              bottom: -24,
              left: -24,
              background: "#fff",
              padding: "20px 28px",
              borderRadius: "var(--radius)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#16a34a",
              }}
            >
              <span className="material-symbols-outlined">sentiment_satisfied</span>
            </div>
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Current Mood
              </p>
              <p style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>
                Feeling Peaceful
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2
            custom={0}
            variants={fadeUp}
            style={{
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Comprehensive Support
          </motion.h2>
          <motion.p
            custom={1}
            variants={fadeUp}
            style={{ color: "var(--text-secondary)", marginBottom: 48, maxWidth: 600 }}
          >
            Tailored solutions to ensure you never have to face your mental well-being journey
            alone.
          </motion.p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {[
            {
              icon: "chat_bubble",
              title: "Expert AI Therapists",
              desc: "24/7 access to empathetic AI-driven conversation trained on clinical psychological frameworks.",
              href: "/chat",
            },
            {
              icon: "medical_services",
              title: "Direct Psychiatrist Connect",
              desc: "Seamlessly bridge the gap to professional medical psychiatric care for prescriptions and diagnosis.",
              href: "/doctors",
            },
            {
              icon: "groups",
              title: "Peer Community Forums",
              desc: "Join a safe, moderated space to share lived experiences and find meaningful peer-to-peer support.",
              href: "/community",
            },
            {
              icon: "edit_note",
              title: "Daily Thoughts Log",
              desc: "Track moods, journal daily, and visualize your emotional progress over time with AI insights.",
              href: "/log",
            },
            {
              icon: "emergency",
              title: "Emergency Red Button",
              desc: "Instant 24/7 crisis hotline connection with automatic location sharing to your emergency contacts.",
              href: "/emergency",
            },
            {
              icon: "self_improvement",
              title: "Wellness & Meditation",
              desc: "Guided breathing exercises, meditation timers, grounding techniques, and AI-generated sleep stories.",
              href: "/wellness",
            },
          ].map((feature, i) => (
            <motion.a
              key={feature.title}
              href={feature.href}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                padding: 32,
                borderRadius: "var(--radius)",
                border: "1px solid var(--border-color)",
                background: "#fff",
                textDecoration: "none",
                color: "inherit",
                transition: "box-shadow 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(236,91,19,0.12)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "rgba(236,91,19,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  transition: "background 0.3s, color 0.3s",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                  {feature.icon}
                </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>{feature.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ─── Daily Snapshot / Mood Preview ─── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            borderRadius: "var(--radius)",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #221610 100%)",
            padding: "64px",
            color: "#fff",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "33%",
              height: "100%",
              background: "rgba(236,91,19,0.1)",
              filter: "blur(80px)",
              borderRadius: "50%",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
              Your Daily <br />
              <span style={{ color: "var(--primary)" }}>Mental Snapshot</span>
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: 32 }}>
              Track your progress and reflect on your day with our minimalist logging tools. Data is
              encrypted and private to you.
            </p>
            <div style={{ display: "flex", gap: 40 }}>
              <div>
                <p style={{ fontSize: 36, fontWeight: 700 }}>85%</p>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>Consistency</p>
              </div>
              <div style={{ width: 1, background: "#334155" }} />
              <div>
                <p style={{ fontSize: 36, fontWeight: 700 }}>12</p>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>Days Streak</p>
              </div>
            </div>
          </div>

          {/* Mood widget preview */}
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius)",
              padding: 28,
              color: "var(--text-primary)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h4 style={{ fontWeight: 700 }}>Mood Tracker</h4>
              <span
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Trending Up
              </span>
            </div>
            <svg
              viewBox="0 0 400 100"
              style={{ width: "100%", height: 120, marginBottom: 8 }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="moodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#ec5b13", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#ec5b13", stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <path
                d="M0,80 Q50,70 100,40 T200,60 T300,20 T400,30"
                fill="none"
                stroke="#ec5b13"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M0,80 Q50,70 100,40 T200,60 T300,20 T400,30 V100 H0 Z"
                fill="url(#moodGrad)"
                opacity="0.1"
              />
            </svg>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                padding: "0 4px",
                marginBottom: 24,
              }}
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <a
              href="/log"
              style={{
                display: "block",
                textAlign: "center",
                background: "var(--primary)",
                color: "#fff",
                padding: "14px",
                borderRadius: "var(--radius)",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
            >
              Log Today&apos;s Thoughts
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
