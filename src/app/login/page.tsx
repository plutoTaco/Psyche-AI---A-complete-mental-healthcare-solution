"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Account created successfully! You can now log in." });
        setIsSignUp(false);
        setPassword("");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: 440,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "var(--primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              marginBottom: 20,
              boxShadow: "0 12px 32px var(--shadow-primary)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
              psychology
            </span>
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            {isSignUp
              ? "Start your mental wellness journey with Psyche AI"
              : "Sign in to continue your wellness journey"}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border-color)",
            padding: 32,
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          }}
        >
          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                marginBottom: 20,
                fontSize: 14,
                fontWeight: 500,
                background: message.type === "error" ? "#fef2f2" : "#f0fdf4",
                color: message.type === "error" ? "#dc2626" : "#16a34a",
                border: `1px solid ${message.type === "error" ? "#fecaca" : "#bbf7d0"}`,
              }}
            >
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 20,
                    color: "var(--text-secondary)",
                  }}
                >
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 14px 14px 44px",
                    borderRadius: 10,
                    border: "1.5px solid var(--border-color)",
                    fontSize: 15,
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    background: "var(--bg-light)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236,91,19,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-color)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 20,
                    color: "var(--text-secondary)",
                  }}
                >
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                  required
                  minLength={6}
                  style={{
                    width: "100%",
                    padding: "14px 14px 14px 44px",
                    borderRadius: 10,
                    border: "1.5px solid var(--border-color)",
                    fontSize: 15,
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    background: "var(--bg-light)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236,91,19,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-color)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
              {isSignUp && (
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                  Must be at least 6 characters
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 10,
                border: "none",
                background: loading
                  ? "var(--text-secondary)"
                  : "var(--primary)",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: loading ? "none" : "0 8px 24px var(--shadow-primary)",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {loading ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 18,
                      animation: "spin 1s linear infinite",
                    }}
                  >
                    progress_activity
                  </span>
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </span>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              margin: "24px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>
              {isSignUp ? "Already have an account?" : "New to Psyche AI?"}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
          </div>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              border: "2px solid var(--border-color)",
              background: "transparent",
              color: "var(--primary)",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(236,91,19,0.05)";
              e.currentTarget.style.borderColor = "rgba(236,91,19,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--border-color)";
            }}
          >
            {isSignUp ? "Sign In Instead" : "Create an Account"}
          </button>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "var(--text-secondary)",
            marginTop: 24,
            lineHeight: 1.6,
          }}
        >
          By continuing, you agree to Psyche AI&apos;s Terms of Service and Privacy Policy.
          <br />
          If you are in crisis, call{" "}
          <a href="tel:988" style={{ color: "var(--emergency-red)", fontWeight: 700 }}>
            988
          </a>{" "}
          (Suicide &amp; Crisis Lifeline).
        </p>
      </motion.div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
