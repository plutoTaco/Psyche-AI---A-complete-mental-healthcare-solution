"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    bio: "Taking one day at a time.",
  });
  const [contacts, setContacts] = useState([
    { name: "Mom", phone: "+1-555-0101", relationship: "Parent" },
    { name: "Best Friend", phone: "+1-555-0102", relationship: "Friend" },
  ]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" });
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const saveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts((prev) => [...prev, newContact]);
      setNewContact({ name: "", phone: "", relationship: "" });
      setShowAddContact(false);
    }
  };

  const sections = [
    { id: "profile", label: "Profile", icon: "person" },
    { id: "emergency", label: "Emergency Contacts", icon: "emergency" },
    { id: "preferences", label: "Preferences", icon: "settings" },
    { id: "privacy", label: "Privacy & Data", icon: "lock" },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 40 }}>
      {/* ─── Sidebar ─── */}
      <div>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 12px",
            background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36 }}>person</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{profile.name}</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{profile.email}</p>
        </div>

        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 16px",
              borderRadius: "var(--radius)", background: activeSection === s.id ? "rgba(236,91,19,0.1)" : "transparent",
              color: activeSection === s.id ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: activeSection === s.id ? 700 : 500, fontSize: 14, border: "none",
              cursor: "pointer", fontFamily: "inherit", marginBottom: 4, textAlign: "left", transition: "all 0.2s",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* ─── Content ─── */}
      <div>
        {activeSection === "profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Profile Settings</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Display Name", value: profile.name, key: "name" as const },
                { label: "Email", value: profile.email, key: "email" as const },
                { label: "Bio", value: profile.bio, key: "bio" as const },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                    style={{
                      width: "100%", padding: "14px 18px", borderRadius: "var(--radius)", border: "1px solid var(--border-color)",
                      fontFamily: "inherit", fontSize: 15, outline: "none", transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                  />
                </div>
              ))}
              <button
                onClick={saveProfile}
                style={{
                  padding: "16px 32px", borderRadius: "var(--radius)", width: "fit-content",
                  background: saved ? "#22c55e" : "var(--primary)", color: "#fff", fontWeight: 700, fontSize: 15,
                  border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s",
                  boxShadow: "0 4px 16px var(--shadow-primary)",
                }}
              >
                {saved ? "✓ Saved!" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        )}

        {activeSection === "emergency" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Emergency Contacts</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                  These contacts will be notified with your location when you activate the emergency SOS.
                </p>
              </div>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "12px 24px",
                  borderRadius: "var(--radius-full)", background: "var(--primary)", color: "#fff",
                  fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                Add Contact
              </button>
            </div>

            {showAddContact && (
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact((p) => ({ ...p, name: e.target.value }))}
                  style={{ flex: 1, padding: "12px 16px", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", fontFamily: "inherit", fontSize: 14, outline: "none" }}
                />
                <input placeholder="Phone" value={newContact.phone} onChange={(e) => setNewContact((p) => ({ ...p, phone: e.target.value }))}
                  style={{ flex: 1, padding: "12px 16px", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", fontFamily: "inherit", fontSize: 14, outline: "none" }}
                />
                <input placeholder="Relationship" value={newContact.relationship} onChange={(e) => setNewContact((p) => ({ ...p, relationship: e.target.value }))}
                  style={{ flex: 1, padding: "12px 16px", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", fontFamily: "inherit", fontSize: 14, outline: "none" }}
                />
                <button onClick={addContact}
                  style={{ padding: "12px 24px", borderRadius: "var(--radius)", background: "var(--primary)", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  Save
                </button>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {contacts.map((c, i) => (
                <div key={i} style={{
                  padding: 20, borderRadius: "var(--radius)", background: "#fff", border: "1px solid var(--border-color)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", background: "rgba(236,91,19,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)",
                    }}>
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</p>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.phone} {c.relationship && `• ${c.relationship}`}</p>
                    </div>
                  </div>
                  <button onClick={() => setContacts((prev) => prev.filter((_, idx) => idx !== i))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === "preferences" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Preferences</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Daily journal reminders", desc: "Get a notification each evening to log your thoughts", checked: true },
                { label: "Weekly mood reports", desc: "Receive a summary of your mood trends each Sunday", checked: true },
                { label: "Community notifications", desc: "Get notified when someone replies to your posts", checked: false },
                { label: "Sound effects", desc: "Play sounds during breathing and meditation exercises", checked: true },
              ].map((pref) => (
                <label key={pref.label} style={{
                  padding: 20, borderRadius: "var(--radius)", background: "#fff", border: "1px solid var(--border-color)",
                  display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{pref.label}</p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{pref.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={pref.checked} style={{ width: 20, height: 20, accentColor: "var(--primary)" }} />
                </label>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === "privacy" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Privacy & Data</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: 24, borderRadius: "var(--radius)", background: "#fff", border: "1px solid var(--border-color)" }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Your Data is Private</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
                  All your journal entries, chat conversations, and mood data are encrypted and stored securely.
                  We never share your personal data with third parties. You have full control over your information.
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button style={{
                    padding: "12px 24px", borderRadius: "var(--radius)", background: "rgba(236,91,19,0.1)",
                    color: "var(--primary)", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14,
                  }}>
                    Export My Data
                  </button>
                  <button style={{
                    padding: "12px 24px", borderRadius: "var(--radius)", background: "rgba(220,38,38,0.1)",
                    color: "var(--emergency-red)", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14,
                  }}>
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
