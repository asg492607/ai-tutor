import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  ArrowRight, 
  BrainCircuit, 
  Layers, 
  ShieldAlert,
  Compass
} from "lucide-react";

export default function MisconceptionsView({ onTargetMisconception }) {
  const [misconceptions, setMisconceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.analytics.getMisconceptions();
        setMisconceptions(data);
      } catch (err) {
        console.error("Failed to load misconceptions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="badge badge-cyan pulse-glow">Loading Cognitive Misconception Memory...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 24px 80px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div className="badge badge-amber" style={{ marginBottom: "8px" }}>
          COGNITIVE DIAGNOSTIC MEMORY
        </div>
        <h1 style={{ fontSize: "2.2rem" }}>
          Misconceptions & <span className="gradient-text">Mental Model Memory</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "750px" }}>
          In our system, mistakes do not vanish into chat history. The pedagogical engine identifies 
          the exact flawed mental model, logs occurrences, and applies specialized counter-strategies 
          (e.g. Counter-Examples, Compare & Contrast) until true cognitive alignment is achieved.
        </p>
      </div>

      {misconceptions.length === 0 ? (
        <div className="glass-panel" style={{ padding: "60px 24px", textAlign: "center" }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(52, 211, 153, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto"
          }}>
            <CheckCircle size={32} color="var(--emerald-400)" />
          </div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>No Active Misconceptions Diagnosed</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
            As you practice in the Classroom Studio, any systematic mistakes in vector direction, algebraic signs, or algorithmic bounds will be captured and diagnosed here.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
          {misconceptions.map((m) => {
            const isActive = m.status === "Active";
            return (
              <div 
                key={m.id}
                className="glass-panel"
                style={{
                  padding: "24px",
                  border: isActive ? "1px solid rgba(251, 113, 133, 0.3)" : "1px solid rgba(52, 211, 153, 0.3)",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span className={`badge ${isActive ? "badge-rose" : "badge-emerald"}`} style={{ fontSize: "0.7rem" }}>
                    {isActive ? "Active Misconception" : "Mastered & Resolved"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Occurrences: {m.occurrences}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.15rem", marginBottom: "8px", color: isActive ? "var(--rose-400)" : "#ffffff" }}>
                  {m.title}
                </h3>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                  Topic: <strong>{m.topic_name}</strong>
                </div>

                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
                  {m.description}
                </p>

                {m.trigger_mistake && (
                  <div style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.8rem",
                    color: "var(--rose-400)",
                    fontFamily: "var(--font-mono)",
                    marginBottom: "14px"
                  }}>
                    Trigger: "{m.trigger_mistake}"
                  </div>
                )}

                <div style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(56, 189, 248, 0.08)",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  fontSize: "0.8rem",
                  color: "var(--cyan-400)",
                  marginBottom: "16px"
                }}>
                  Prescribed Pedagogy: <strong>{m.counter_strategy}</strong>
                </div>

                {isActive && (
                  <button
                    onClick={() => onTargetMisconception?.(m)}
                    className="btn btn-sm btn-primary"
                    style={{ width: "100%" }}
                  >
                    Target via {m.counter_strategy}
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
