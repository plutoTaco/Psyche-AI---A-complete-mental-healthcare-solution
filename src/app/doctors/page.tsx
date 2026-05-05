"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const DOCTORS = [
  { id: 1, name: "Dr. Sarah Chen", specialty: "Psychiatrist", rating: 4.9, reviews: 127, available: true, bio: "Board-certified psychiatrist specializing in anxiety disorders and PTSD. 12 years of clinical experience.", avatar: "person" },
  { id: 2, name: "Dr. James Rivera", specialty: "Psychologist", rating: 4.8, reviews: 98, available: true, bio: "Clinical psychologist with expertise in cognitive behavioral therapy and relationship counseling.", avatar: "person" },
  { id: 3, name: "Dr. Priya Sharma", specialty: "Therapist", rating: 4.9, reviews: 203, available: false, bio: "Licensed therapist specializing in mindfulness-based stress reduction and trauma recovery.", avatar: "person" },
  { id: 4, name: "Dr. Michael Park", specialty: "Psychiatrist", rating: 4.7, reviews: 85, available: true, bio: "Specializes in medication management for depression, bipolar disorder, and ADHD.", avatar: "person" },
  { id: 5, name: "Dr. Emily Watson", specialty: "Psychologist", rating: 4.8, reviews: 156, available: true, bio: "Expert in adolescent psychology and family therapy. Warm, approachable style.", avatar: "person" },
  { id: 6, name: "Dr. Ahmed Hassan", specialty: "Therapist", rating: 4.6, reviews: 72, available: false, bio: "Specializes in grief counseling and existential therapy. Multilingual practitioner.", avatar: "person" },
];

const SPECIALTIES = ["All", "Psychiatrist", "Psychologist", "Therapist"];
const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState<typeof DOCTORS[0] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filtered = DOCTORS.filter(
    (d) =>
      (activeFilter === "All" || d.specialty === activeFilter) &&
      (d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  const confirmBooking = () => {
    if (selectedDoctor && selectedSlot) {
      setBookingConfirmed(true);
      setTimeout(() => {
        setBookingConfirmed(false);
        setSelectedDoctor(null);
        setSelectedSlot(null);
      }, 3000);
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>Find a Doctor</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32, maxWidth: 600 }}>
          Connect with licensed psychiatrists, psychologists, and therapists for professional support. Book a video consultation today.
        </p>
      </motion.div>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32, alignItems: "center" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 20px",
            borderRadius: "var(--radius-full)",
            background: "#fff",
            border: "1px solid var(--border-color)",
          }}
        >
          <span className="material-symbols-outlined" style={{ color: "var(--text-secondary)", fontSize: 20 }}>
            search
          </span>
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: "none", background: "transparent", fontFamily: "inherit", fontSize: 15, outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {SPECIALTIES.map((s) => (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              style={{
                padding: "10px 20px",
                borderRadius: "var(--radius-full)",
                background: activeFilter === s ? "var(--primary)" : "#fff",
                color: activeFilter === s ? "#fff" : "var(--text-secondary)",
                border: `1px solid ${activeFilter === s ? "var(--primary)" : "var(--border-color)"}`,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedDoctor ? "1fr 400px" : "1fr", gap: 32 }}>
        {/* Doctor Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setSelectedDoctor(doc); setSelectedSlot(null); setBookingConfirmed(false); }}
              style={{
                padding: 24,
                borderRadius: "var(--radius)",
                background: "#fff",
                border: `2px solid ${selectedDoctor?.id === doc.id ? "var(--primary)" : "var(--border-color)"}`,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (selectedDoctor?.id !== doc.id) e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                    {doc.avatar}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{doc.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>{doc.specialty}</p>
                </div>
                {doc.available && (
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "var(--radius-full)",
                      background: "#dcfce7",
                      color: "#15803d",
                      fontSize: 11,
                      fontWeight: 700,
                      height: "fit-content",
                    }}
                  >
                    Available
                  </span>
                )}
              </div>

              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>
                {doc.bio}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#f59e0b", fontSize: 16 }}>★</span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{doc.rating}</span>
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>({doc.reviews} reviews)</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booking Panel */}
        {selectedDoctor && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              padding: 28,
              borderRadius: "var(--radius)",
              background: "#fff",
              border: "1px solid var(--border-color)",
              alignSelf: "start",
              position: "sticky",
              top: 100,
            }}
          >
            {bookingConfirmed ? (
              <div style={{ textAlign: "center", padding: 32 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 56, color: "#22c55e", marginBottom: 12 }}>
                  check_circle
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Booking Confirmed!</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  Your appointment with {selectedDoctor.name} has been scheduled.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
                  Book with {selectedDoctor.name}
                </h3>
                <p style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600, marginBottom: 24 }}>
                  {selectedDoctor.specialty}
                </p>

                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Available Time Slots — Today
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: "12px",
                        borderRadius: "var(--radius)",
                        border: `2px solid ${selectedSlot === slot ? "var(--primary)" : "var(--border-color)"}`,
                        background: selectedSlot === slot ? "rgba(236,91,19,0.08)" : "#fff",
                        color: selectedSlot === slot ? "var(--primary)" : "var(--text-primary)",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <button
                  onClick={confirmBooking}
                  disabled={!selectedSlot}
                  style={{
                    width: "100%",
                    padding: 16,
                    borderRadius: "var(--radius)",
                    background: selectedSlot ? "var(--primary)" : "rgba(0,0,0,0.05)",
                    color: selectedSlot ? "#fff" : "var(--text-secondary)",
                    fontWeight: 700,
                    fontSize: 16,
                    border: "none",
                    cursor: selectedSlot ? "pointer" : "default",
                    fontFamily: "inherit",
                    boxShadow: selectedSlot ? "0 8px 24px var(--shadow-primary)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  Confirm Appointment
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
