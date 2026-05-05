"use client";

export function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid var(--border-color)",
        background: "rgba(248,246,246,0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
              psychology
            </span>
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "var(--primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Serenity AI
          </span>
        </a>

        {/* Nav Links */}
        <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[
            { href: "/chat", label: "AI Therapy" },
            { href: "/log", label: "Daily Log" },
            { href: "/doctors", label: "Find a Doctor" },
            { href: "/community", label: "Community" },
            { href: "/wellness", label: "Wellness" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Emergency + Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a
            href="/emergency"
            className="emergency-glow"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--emergency-red)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "var(--radius-full)",
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              textDecoration: "none",
              transition: "transform 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              emergency
            </span>
            EMERGENCY 24/7
          </a>
          <a
            href="/profile"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              person
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-color)",
        background: "#fff",
        padding: "48px 24px",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              psychology
            </span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)" }}>
            Serenity AI
          </span>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: "var(--text-secondary)" }}>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Privacy Policy</a>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Terms of Service</a>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Contact Support</a>
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8" }}>
          © 2025 Serenity AI. All rights reserved. If you are in crisis, call{" "}
          <a href="tel:988" style={{ color: "var(--emergency-red)", fontWeight: 700 }}>988</a>{" "}
          (Suicide &amp; Crisis Lifeline).
        </p>
      </div>
    </footer>
  );
}
