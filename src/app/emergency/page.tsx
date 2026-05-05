"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EmergencyPage() {
  const [step, setStep] = useState<"initial" | "confirming" | "activated">("initial");
  const [countdown, setCountdown] = useState(3);
  const [locationStatus, setLocationStatus] = useState<string>("");
  const [contacts, setContacts] = useState([
    { name: "Mom", phone: "+1-555-0101" },
    { name: "Best Friend", phone: "+1-555-0102" },
  ]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    if (step === "confirming" && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (step === "confirming" && countdown === 0) {
      activateEmergency();
    }
  }, [step, countdown]);

  const activateEmergency = () => {
    setStep("activated");
    setLocationStatus("Detecting location...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationStatus(
            `Location shared: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          );
        },
        () => setLocationStatus("Location unavailable — please share manually"),
        { enableHighAccuracy: true }
      );
    } else {
      setLocationStatus("Geolocation not supported by your browser");
    }
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts((prev) => [...prev, newContact]);
      setNewContact({ name: "", phone: "" });
      setShowAddContact(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 73px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        background: step === "activated" ? "linear-gradient(135deg, #fef2f2, #f8f6f6)" : "var(--bg-light)",
        transition: "background 0.5s",
      }}
    >
      <motion.div
        layout
        style={{
          width: "100%",
          maxWidth: 600,
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* ─── Initial State ─── */}
        <AnimatePresence mode="wait">
          {step === "initial" && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: 48, textAlign: "center" }}
            >
              <div
                className="emergency-glow"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "var(--emergency-red)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#fff" }}>
                  emergency
                </span>
              </div>

              <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
                Emergency Support
              </h1>
              <p style={{ color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.6 }}>
                If you are in crisis or need immediate help, we&apos;re here for you. This will
                connect you to a 24/7 crisis hotline and share your location with your emergency
                contacts.
              </p>

              <button
                onClick={() => {
                  setStep("confirming");
                  setCountdown(3);
                }}
                className="emergency-glow"
                style={{
                  width: "100%",
                  padding: "20px",
                  borderRadius: "var(--radius)",
                  background: "var(--emergency-red)",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 800,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "transform 0.2s",
                  marginBottom: 16,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                🚨 Activate Emergency SOS
              </button>

              <a
                href="tel:988"
                style={{
                  display: "block",
                  padding: "16px",
                  borderRadius: "var(--radius)",
                  border: "2px solid var(--emergency-red)",
                  color: "var(--emergency-red)",
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: "none",
                  marginBottom: 16,
                }}
              >
                📞 Call 988 Crisis Lifeline Directly
              </a>

              <button
                onClick={() => (window.location.href = "https://www.google.com")}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "var(--radius)",
                  background: "rgba(0,0,0,0.05)",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ← Quick Exit (goes to Google)
              </button>
            </motion.div>
          )}

          {/* ─── Confirming (Countdown) ─── */}
          {step === "confirming" && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: 48, textAlign: "center" }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  border: "6px solid var(--emergency-red)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: "var(--emergency-red)",
                  }}
                >
                  {countdown}
                </span>
                {/* Progress ring */}
                <svg
                  style={{
                    position: "absolute",
                    top: -6,
                    left: -6,
                    width: 120,
                    height: 120,
                    transform: "rotate(-90deg)",
                  }}
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="var(--emergency-red)"
                    strokeWidth="6"
                    strokeDasharray={`${(339.29 * (3 - countdown)) / 3} 339.29`}
                    style={{ transition: "stroke-dasharray 1s linear" }}
                  />
                </svg>
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                Activating Emergency...
              </h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
                Your location will be shared with emergency contacts
              </p>

              <button
                onClick={() => setStep("initial")}
                style={{
                  padding: "16px 40px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(0,0,0,0.05)",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: "var(--text-secondary)",
                }}
              >
                Cancel
              </button>
            </motion.div>
          )}

          {/* ─── Activated ─── */}
          {step === "activated" && (
            <motion.div
              key="activated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: 48 }}
            >
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 56, color: "#22c55e", marginBottom: 12 }}
                >
                  check_circle
                </span>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                  Help Is On the Way
                </h2>
                <p style={{ color: "var(--text-secondary)" }}>
                  We&apos;ve notified your emergency contacts with your location.
                </p>
              </div>

              {/* Location status */}
              <div
                style={{
                  padding: 16,
                  borderRadius: "var(--radius)",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span className="material-symbols-outlined" style={{ color: "#22c55e" }}>
                  location_on
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{locationStatus}</span>
              </div>

              {/* Contacts notified */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Contacts Notified
                </p>
                {contacts.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: "var(--radius)",
                      background: "rgba(0,0,0,0.02)",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: "var(--text-secondary)" }}>{c.phone}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <a
                  href="tel:988"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: 16,
                    borderRadius: "var(--radius)",
                    background: "var(--emergency-red)",
                    color: "#fff",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontFamily: "inherit",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    call
                  </span>
                  Call 988 Now
                </a>
                <button
                  onClick={() => setStep("initial")}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)",
                    background: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  I&apos;m Okay Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Emergency Contacts Management ─── */}
        {step === "initial" && (
          <div style={{ padding: "0 48px 48px", borderTop: "1px solid var(--border-color)", paddingTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Emergency Contacts</h3>
              <button
                onClick={() => setShowAddContact((s) => !s)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(236,91,19,0.1)",
                  color: "var(--primary)",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                + Add Contact
              </button>
            </div>

            {contacts.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: "var(--radius)",
                  background: "rgba(0,0,0,0.02)",
                  marginBottom: 8,
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{c.phone}</p>
                </div>
                <button
                  onClick={() => setContacts((prev) => prev.filter((_, idx) => idx !== i))}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    delete
                  </span>
                </button>
              </div>
            ))}

            <AnimatePresence>
              {showAddContact && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden", marginTop: 12 }}
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Name"
                      value={newContact.name}
                      onChange={(e) => setNewContact((p) => ({ ...p, name: e.target.value }))}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border-color)",
                        fontFamily: "inherit",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact((p) => ({ ...p, phone: e.target.value }))}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border-color)",
                        fontFamily: "inherit",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={addContact}
                      style={{
                        padding: "12px 24px",
                        borderRadius: "var(--radius)",
                        background: "var(--primary)",
                        color: "#fff",
                        border: "none",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
