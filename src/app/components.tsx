"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get the current user on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

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
            Psyche AI
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

        {/* Emergency + Auth */}
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

          {/* Auth Area */}
          {loading ? (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--border-color)",
              }}
            />
          ) : user ? (
            /* Logged In: Avatar + Dropdown */
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                  fontSize: 16,
                  fontWeight: 700,
                }}
                title={user.email || "Profile"}
              >
                {user.email ? user.email[0].toUpperCase() : (
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    person
                  </span>
                )}
              </a>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  border: "1.5px solid var(--border-color)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--emergency-red)";
                  e.currentTarget.style.color = "var(--emergency-red)";
                  e.currentTarget.style.background = "rgba(220,38,38,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  logout
                </span>
                Logout
              </button>
            </div>
          ) : (
            /* Logged Out: Login Button */
            <a
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 24px",
                borderRadius: "var(--radius-full)",
                background: "var(--primary)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 16px var(--shadow-primary)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                login
              </span>
              Login
            </a>
          )}
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
            Psyche AI
          </span>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: "var(--text-secondary)" }}>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Privacy Policy</a>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Terms of Service</a>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Contact Support</a>
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8" }}>
          © 2025 Psyche AI. All rights reserved. If you are in crisis, call{" "}
          <a href="tel:988" style={{ color: "var(--emergency-red)", fontWeight: 700 }}>988</a>{" "}
          (Suicide &amp; Crisis Lifeline).
        </p>
      </div>
    </footer>
  );
}
