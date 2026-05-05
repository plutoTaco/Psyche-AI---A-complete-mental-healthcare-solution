"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const PERSONAS = [
  {
    id: "maya",
    name: "Dr. Maya",
    specialty: "CBT Specialist",
    avatar: "psychology",
    color: "#ec5b13",
  },
  {
    id: "kai",
    name: "Dr. Kai",
    specialty: "Mindfulness & Wellness",
    avatar: "spa",
    color: "#0ea5e9",
  },
  {
    id: "ava",
    name: "Ava",
    specialty: "Crisis Counselor",
    avatar: "health_and_safety",
    color: "#8b5cf6",
  },
];

// Extend Window interface for SpeechRecognition
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [showPersonaSelector, setShowPersonaSelector] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Voice State ───
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const lastSpokenMsgId = useRef<string | null>(null);

  // Check browser support & load voices on mount
  useEffect(() => {
    setSttSupported(
      typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    );
    const hasTts = typeof window !== "undefined" && "speechSynthesis" in window;
    setTtsSupported(hasTts);

    if (hasTts) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
          // Auto-select a nice default voice
          const preferred = voices.find(
            (v) =>
              v.name.includes("Jenny") ||
              v.name.includes("Aria") ||
              v.name.includes("Samantha") ||
              (v.name.includes("Google") && v.lang.startsWith("en"))
          );
          if (!selectedVoice) {
            setSelectedVoice(preferred || voices.find(v => v.lang.startsWith("en")) || voices[0]);
          }
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── TTS: Speak AI response when streaming completes ───
  const speakText = useCallback(
    (text: string) => {
      if (!ttsSupported || !ttsEnabled) return;
      window.speechSynthesis.cancel(); // stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Use selected voice
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [ttsEnabled, ttsSupported, selectedVoice]
  );

  const stopSpeaking = useCallback(() => {
    if (ttsSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [ttsSupported]);

  // ─── STT: Speech Recognition ───
  const startListening = useCallback(() => {
    if (!sttSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onstart = () => {
      setIsListening(true);
      stopSpeaking(); // stop TTS if speaking
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      setInput(finalTranscript + interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [sttSupported, stopSpeaking]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // ─── Send Message ───
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Stop listening if active
    if (isListening) stopListening();
    stopSpeaking();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowPersonaSelector(false);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          persona: selectedPersona.id,
        }),
      });

      if (!response.ok) throw new Error("Chat request failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulated = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split("\n").filter((line) => line.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              accumulated += parsed.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id ? { ...m, content: accumulated } : m
                )
              );
            } catch {
              // skip parse errors
            }
          }
        }

        // TTS: Speak the full response after streaming completes
        if (accumulated && ttsEnabled && lastSpokenMsgId.current !== assistantMessage.id) {
          lastSpokenMsgId.current = assistantMessage.id;
          speakText(accumulated);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: "I'm sorry, I'm having trouble connecting right now. Please try again, or if you're in crisis, please click the Emergency button above." }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 73px)", overflow: "hidden" }}>
      {/* ─── Left Panel: Avatar ─── */}
      <section
        style={{
          width: "55%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          position: "relative",
          background: "linear-gradient(180deg, #f8f6f6, #fff)",
        }}
      >
        {/* Persona avatar */}
        <motion.div
          key={selectedPersona.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            maxWidth: 600,
            aspectRatio: "4/3",
            borderRadius: "var(--radius)",
            background: `linear-gradient(135deg, ${selectedPersona.color}15, ${selectedPersona.color}08)`,
            boxShadow: "0 24px 64px rgba(0,0,0,0.08)",
            border: `1px solid ${selectedPersona.color}20`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Speaking animation rings */}
          <AnimatePresence>
            {isSpeaking && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={`ring-${i}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [0.8, 1.8],
                      opacity: [0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeOut",
                    }}
                    style={{
                      position: "absolute",
                      width: 160,
                      height: 160,
                      borderRadius: "50%",
                      border: `2px solid ${selectedPersona.color}`,
                      pointerEvents: "none",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <span
            className="material-symbols-outlined"
            style={{ fontSize: 120, color: selectedPersona.color, opacity: 0.2 }}
          >
            {selectedPersona.avatar}
          </span>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: selectedPersona.color }}>
              {selectedPersona.name}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 600 }}>
              {selectedPersona.specialty}
            </p>
          </div>

          {/* Status indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              className="pulse-gentle"
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: isSpeaking
                  ? "#22c55e"
                  : isLoading
                  ? selectedPersona.color
                  : isListening
                  ? "#ef4444"
                  : "#22c55e",
              }}
            />
            <p style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: 14 }}>
              {isSpeaking
                ? `${selectedPersona.name} is speaking...`
                : isLoading
                ? `${selectedPersona.name} is thinking...`
                : isListening
                ? "Listening to you..."
                : `${selectedPersona.name} is listening...`}
            </p>
          </div>

          {/* TTS / Speaking controls in top-right */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            {/* Stop speaking button */}
            {isSpeaking && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={stopSpeaking}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.2)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Stop speaking"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  stop_circle
                </span>
              </motion.button>
            )}

            {/* Voice picker */}
            {ttsSupported && availableVoices.length > 0 && (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowVoicePicker(!showVoicePicker)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: showVoicePicker
                      ? `${selectedPersona.color}20`
                      : `${selectedPersona.color}10`,
                    color: selectedPersona.color,
                    border: `1px solid ${selectedPersona.color}30`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  title="Change voice"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    record_voice_over
                  </span>
                </button>

                {/* Voice dropdown */}
                <AnimatePresence>
                  {showVoicePicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute",
                        top: 44,
                        right: 0,
                        width: 300,
                        maxHeight: 360,
                        overflowY: "auto",
                        background: "#fff",
                        borderRadius: 12,
                        boxShadow: "0 16px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                        zIndex: 100,
                        padding: 8,
                      }}
                    >
                      <p style={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--text-secondary)",
                        padding: "8px 12px 4px",
                      }}>
                        Choose Voice
                      </p>
                      {availableVoices
                        .filter(v => v.lang.startsWith("en"))
                        .map((voice, idx) => (
                          <button
                            key={`${voice.name}-${idx}`}
                            onClick={() => {
                              setSelectedVoice(voice);
                              setShowVoicePicker(false);
                              // Preview the voice
                              window.speechSynthesis.cancel();
                              const preview = new SpeechSynthesisUtterance("Hello, I'm here to help you.");
                              preview.voice = voice;
                              preview.rate = 0.95;
                              window.speechSynthesis.speak(preview);
                            }}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "10px 12px",
                              borderRadius: 8,
                              border: "none",
                              background: selectedVoice?.name === voice.name
                                ? `${selectedPersona.color}12`
                                : "transparent",
                              cursor: "pointer",
                              textAlign: "left",
                              fontFamily: "inherit",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              if (selectedVoice?.name !== voice.name)
                                e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                            }}
                            onMouseLeave={(e) => {
                              if (selectedVoice?.name !== voice.name)
                                e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{
                                fontSize: 18,
                                color: selectedVoice?.name === voice.name
                                  ? selectedPersona.color
                                  : "var(--text-secondary)",
                              }}
                            >
                              {selectedVoice?.name === voice.name ? "check_circle" : "radio_button_unchecked"}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                fontSize: 13,
                                fontWeight: selectedVoice?.name === voice.name ? 700 : 500,
                                color: selectedVoice?.name === voice.name
                                  ? selectedPersona.color
                                  : "var(--text-primary)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}>
                                {voice.name.replace("Microsoft ", "").replace("Online (Natural)", "").replace(" - English (United States)", "").replace(" - English (United Kingdom)", " (UK)").trim()}
                              </p>
                              <p style={{
                                fontSize: 10,
                                color: "var(--text-secondary)",
                                marginTop: 1,
                              }}>
                                {voice.lang} {voice.localService ? "• Local" : "• Online"}
                              </p>
                            </div>
                          </button>
                        ))}
                      {availableVoices.filter(v => !v.lang.startsWith("en")).length > 0 && (
                        <>
                          <div style={{
                            height: 1,
                            background: "var(--border-color)",
                            margin: "8px 12px",
                          }} />
                          <p style={{
                            fontSize: 11,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "var(--text-secondary)",
                            padding: "4px 12px",
                          }}>
                            Other Languages
                          </p>
                          {availableVoices
                            .filter(v => !v.lang.startsWith("en"))
                            .slice(0, 20)
                            .map((voice, idx) => (
                              <button
                                key={`other-${voice.name}-${idx}`}
                                onClick={() => {
                                  setSelectedVoice(voice);
                                  setShowVoicePicker(false);
                                  window.speechSynthesis.cancel();
                                  const preview = new SpeechSynthesisUtterance("Hello");
                                  preview.voice = voice;
                                  preview.rate = 0.95;
                                  window.speechSynthesis.speak(preview);
                                }}
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "10px 12px",
                                  borderRadius: 8,
                                  border: "none",
                                  background: selectedVoice?.name === voice.name
                                    ? `${selectedPersona.color}12`
                                    : "transparent",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  fontFamily: "inherit",
                                  transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedVoice?.name !== voice.name)
                                    e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedVoice?.name !== voice.name)
                                    e.currentTarget.style.background = "transparent";
                                }}
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{
                                    fontSize: 18,
                                    color: selectedVoice?.name === voice.name
                                      ? selectedPersona.color
                                      : "var(--text-secondary)",
                                  }}
                                >
                                  {selectedVoice?.name === voice.name ? "check_circle" : "radio_button_unchecked"}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{
                                    fontSize: 13,
                                    fontWeight: selectedVoice?.name === voice.name ? 700 : 500,
                                    color: selectedVoice?.name === voice.name
                                      ? selectedPersona.color
                                      : "var(--text-primary)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}>
                                    {voice.name.replace("Microsoft ", "").replace("Online (Natural)", "").trim()}
                                  </p>
                                  <p style={{
                                    fontSize: 10,
                                    color: "var(--text-secondary)",
                                    marginTop: 1,
                                  }}>
                                    {voice.lang} {voice.localService ? "• Local" : "• Online"}
                                  </p>
                                </div>
                              </button>
                            ))}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TTS toggle */}
            {ttsSupported && (
              <button
                onClick={() => {
                  if (ttsEnabled) stopSpeaking();
                  setTtsEnabled(!ttsEnabled);
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: ttsEnabled
                    ? `${selectedPersona.color}15`
                    : "rgba(0,0,0,0.05)",
                  color: ttsEnabled ? selectedPersona.color : "#aaa",
                  border: `1px solid ${ttsEnabled ? `${selectedPersona.color}30` : "rgba(0,0,0,0.08)"}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                title={ttsEnabled ? "Voice on — click to mute" : "Voice off — click to unmute"}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {ttsEnabled ? "volume_up" : "volume_off"}
                </span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Persona Selector */}
        <AnimatePresence>
          {showPersonaSelector && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                marginTop: 32,
                display: "flex",
                gap: 16,
              }}
            >
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(p)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 24px",
                    borderRadius: "var(--radius-full)",
                    border: `2px solid ${selectedPersona.id === p.id ? p.color : "var(--border-color)"}`,
                    background: selectedPersona.id === p.id ? `${p.color}10` : "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20, color: p.color }}
                  >
                    {p.avatar}
                  </span>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>{p.specialty}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            width: "100%",
            maxWidth: 640,
            padding: "0 40px",
          }}
        >
          <div
            className="glass"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 12,
              borderRadius: "var(--radius-full)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            }}
          >
            {/* Mic button with STT */}
            <button
              onClick={toggleListening}
              disabled={!sttSupported}
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: isListening
                  ? "#ef4444"
                  : selectedPersona.color,
                color: "#fff",
                border: "none",
                cursor: sttSupported ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isListening
                  ? "0 0 0 6px rgba(239,68,68,0.2), 0 8px 24px rgba(239,68,68,0.4)"
                  : `0 8px 24px ${selectedPersona.color}40`,
                transition: "all 0.3s",
                flexShrink: 0,
                position: "relative",
                animation: isListening ? "pulse-mic 1.5s ease-in-out infinite" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isListening) e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              title={
                !sttSupported
                  ? "Speech recognition not supported in this browser"
                  : isListening
                  ? "Stop listening"
                  : "Click to speak"
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                {isListening ? "mic" : "mic"}
              </span>
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening... speak now" : "Type or click mic to speak..."}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: 16,
                color: "var(--text-primary)",
                outline: "none",
                fontFamily: "inherit",
                padding: "8px 0",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background:
                  input.trim() && !isLoading
                    ? `${selectedPersona.color}15`
                    : "rgba(0,0,0,0.03)",
                color: input.trim() && !isLoading ? selectedPersona.color : "#ccc",
                border: "none",
                cursor: input.trim() && !isLoading ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                send
              </span>
            </button>
          </div>

          {/* Listening indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 12,
                  padding: "8px 20px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.15)",
                }}
              >
                {/* Audio wave bars */}
                <div style={{ display: "flex", gap: 3, alignItems: "center", height: 16 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [4, 16, 4],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                      style={{
                        width: 3,
                        borderRadius: 2,
                        background: "#ef4444",
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#ef4444" }}>
                  Listening...
                </span>
                <button
                  onClick={stopListening}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    close
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Right Panel: Chat Transcript ─── */}
      <aside
        style={{
          width: "45%",
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid var(--border-color)",
          background: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 24,
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em" }}>
              Session Transcript
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500, marginTop: 2 }}>
              {messages.length > 0
                ? `${messages.length} messages`
                : `Select a therapist to begin`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowPersonaSelector((s) => !s)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(236,91,19,0.1)",
                color: "var(--primary)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {messages.length === 0 && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                color: "var(--text-secondary)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 56, opacity: 0.3, color: selectedPersona.color }}
              >
                forum
              </span>
              <p style={{ fontSize: 15, fontWeight: 600, textAlign: "center" }}>
                Start a conversation with {selectedPersona.name}
              </p>
              <p style={{ fontSize: 13, textAlign: "center", maxWidth: 300 }}>
                Share what&apos;s on your mind. Everything here is confidential and private.
              </p>
              {sttSupported && (
                <p style={{ fontSize: 12, textAlign: "center", color: "var(--text-secondary)", marginTop: 4 }}>
                  🎤 <strong>Voice enabled</strong> — click the mic to speak
                </p>
              )}
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  maxWidth: "85%",
                  ...(msg.role === "user" ? { marginLeft: "auto", alignItems: "flex-end" } : {}),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color:
                        msg.role === "assistant" ? selectedPersona.color : "var(--text-secondary)",
                      padding: "0 4px",
                    }}
                  >
                    {msg.role === "assistant" ? selectedPersona.name : "You"}
                  </span>
                  {/* Replay TTS button for assistant messages */}
                  {msg.role === "assistant" && msg.content && ttsSupported && !isLoading && (
                    <button
                      onClick={() => speakText(msg.content)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        opacity: 0.5,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
                      title="Read aloud"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                        volume_up
                      </span>
                    </button>
                  )}
                </div>
                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: "var(--radius)",
                    ...(msg.role === "assistant"
                      ? {
                          background: `${selectedPersona.color}10`,
                          border: `1px solid ${selectedPersona.color}20`,
                          borderTopLeftRadius: 4,
                        }
                      : {
                          background: "#fff",
                          border: "1px solid var(--border-color)",
                          borderTopRightRadius: 4,
                        }),
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.6,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                    {msg.role === "assistant" && isLoading && msg.id === messages[messages.length - 1]?.id && (
                      <span
                        className="pulse-gentle"
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 16,
                          background: selectedPersona.color,
                          marginLeft: 2,
                          borderRadius: 2,
                          verticalAlign: "text-bottom",
                        }}
                      />
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Safety footer */}
        <div
          style={{
            padding: 20,
            borderTop: "1px solid var(--border-color)",
            background: "rgba(248,246,246,0.8)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button
              onClick={() => (window.location.href = "https://www.google.com")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px 16px",
                borderRadius: "var(--radius-full)",
                border: "2px solid rgba(236,91,19,0.2)",
                background: "transparent",
                color: "var(--primary)",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                logout
              </span>
              Quick Exit
            </button>
            <a
              href="/emergency"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px 16px",
                borderRadius: "var(--radius-full)",
                background: "var(--emergency-red)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(220,38,38,0.2)",
                transition: "all 0.2s",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                emergency
              </span>
              Get Help Now
            </a>
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: 900,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginTop: 16,
            }}
          >
            Confidential Session
          </p>
        </div>
      </aside>

      {/* Mic pulse animation */}
      <style>{`
        @keyframes pulse-mic {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4), 0 8px 24px rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 0 12px rgba(239,68,68,0), 0 8px 24px rgba(239,68,68,0.3); }
        }
      `}</style>
    </div>
  );
}
