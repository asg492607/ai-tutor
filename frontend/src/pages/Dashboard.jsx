import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen, 
  History, 
  Target, 
  Layers, 
  Award,
  Lock,
  ChevronRight,
  HelpCircle,
  BrainCircuit
} from "lucide-react";

export default function Dashboard({ onStartSession, onResumeSession }) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMode, setSelectedMode] = useState("Learn");
  const [selectedStrategy, setSelectedStrategy] = useState("Socratic Teaching");
  const [strategies, setStrategies] = useState([]);
  const [masteryData, setMasteryData] = useState(null);
  const [misconceptions, setMisconceptions] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingSession, setStartingSession] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [subjs, strats, mastery, miscs, sessions] = await Promise.all([
          api.curriculum.getSubjects(),
          api.curriculum.getStrategies(),
          api.analytics.getMastery(),
          api.analytics.getMisconceptions(),
          api.tutor.getUserSessions(),
        ]);

        setSubjects(subjs);
        setStrategies(strats);
        setMasteryData(mastery);
        setMisconceptions(miscs);
        setRecentSessions(sessions);

        if (subjs.length > 0) {
          setSelectedSubject(subjs[0]);
          const topicList = await api.curriculum.getTopics(subjs[0].id);
          setTopics(topicList);
          if (topicList.length > 0) {
            setSelectedTopic(topicList[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleSubjectChange = async (subj) => {
    setSelectedSubject(subj);
    try {
      const topicList = await api.curriculum.getTopics(subj.id);
      setTopics(topicList);
      if (topicList.length > 0) {
        setSelectedTopic(topicList[0]);
      }
    } catch (err) {
      console.error("Failed to load topics:", err);
    }
  };

  const handleLaunchSession = async () => {
    if (!selectedSubject || !selectedTopic) return;
    setStartingSession(true);
    try {
      const session = await api.tutor.createSession(
        selectedSubject.id,
        selectedTopic.id,
        selectedMode,
        selectedStrategy,
        selectedTopic.difficulty_level
      );
      onStartSession(session.session_id);
    } catch (err) {
      console.error("Failed to start session:", err);
      alert(err.message || "Failed to start session");
    } finally {
      setStartingSession(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="badge badge-cyan pulse-glow" style={{ padding: "8px 16px" }}>
          Synchronizing Cognitive Model & Curriculum...
        </div>
      </div>
    );
  }

  const cognitiveDepth = masteryData?.cognitive_depth || {
    recognition: 15,
    understanding: 10,
    application: 5,
    mastery: 0,
  };

  return (
    <div className="container" style={{ padding: "40px 24px 80px 24px" }}>
      {/* Student Welcome & Command Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "20px",
        marginBottom: "32px"
      }}>
        <div>
          <div className="badge badge-indigo" style={{ marginBottom: "8px" }}>
            STUDENT COMMAND CENTER
          </div>
          <h1 style={{ fontSize: "2.2rem" }}>
            Welcome back, <span className="gradient-text">{user?.name || "Scholar"}</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Track your cognitive depth, target diagnosed misconceptions, and engage with your adaptive personal tutor.
          </p>
        </div>

        <div style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          background: "rgba(15, 23, 42, 0.7)",
          padding: "12px 20px",
          borderRadius: "14px",
          border: "1px solid var(--border-subtle)"
        }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Curriculum Topics Tracked
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--cyan-400)" }}>
              {masteryData?.total_topics_tracked || 0} Topics
            </div>
          </div>
          <div style={{ width: "1px", height: "36px", background: "var(--border-subtle)" }} />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Active Misconceptions
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: misconceptions.filter(m => m.status === "Active").length > 0 ? "var(--rose-400)" : "var(--emerald-400)" }}>
              {misconceptions.filter(m => m.status === "Active").length}
            </div>
          </div>
        </div>
      </div>

      {/* Cognitive Depth 4-Tier Gauge */}
      <div className="glass-panel" style={{ padding: "28px", marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <BrainCircuit size={20} color="var(--cyan-400)" />
              Continuous Understanding vs Memorization Gauge
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Estimated by the pedagogical engine from your step-by-step reasoning, hints required, and novel attempts.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {/* Recognition */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
              <span style={{ fontWeight: 600 }}>1. Recognition</span>
              <span style={{ color: "var(--indigo-400)", fontWeight: 700 }}>{cognitiveDepth.recognition}%</span>
            </div>
            <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${cognitiveDepth.recognition}%`, height: "100%", background: "var(--indigo-400)", transition: "width 0.5s ease" }} />
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Familiarity with formulas & terms
            </div>
          </div>

          {/* Understanding */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
              <span style={{ fontWeight: 600 }}>2. Conceptual Understanding</span>
              <span style={{ color: "var(--cyan-400)", fontWeight: 700 }}>{cognitiveDepth.understanding}%</span>
            </div>
            <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${cognitiveDepth.understanding}%`, height: "100%", background: "var(--cyan-400)", transition: "width 0.5s ease" }} />
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Ability to explain why mechanisms work
            </div>
          </div>

          {/* Application */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
              <span style={{ fontWeight: 600 }}>3. Application</span>
              <span style={{ color: "var(--emerald-400)", fontWeight: 700 }}>{cognitiveDepth.application}%</span>
            </div>
            <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${cognitiveDepth.application}%`, height: "100%", background: "var(--emerald-400)", transition: "width 0.5s ease" }} />
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Independent problem-solving accuracy
            </div>
          </div>

          {/* Mastery */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
              <span style={{ fontWeight: 600 }}>4. True Mastery</span>
              <span style={{ color: "var(--amber-400)", fontWeight: 700 }}>{cognitiveDepth.mastery}%</span>
            </div>
            <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${cognitiveDepth.mastery}%`, height: "100%", background: "var(--amber-400)", transition: "width 0.5s ease" }} />
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Novel scenarios without hints
            </div>
          </div>
        </div>
      </div>

      {/* Active Misconceptions Alert Banner */}
      {misconceptions.filter(m => m.status === "Active").length > 0 && (
        <div style={{
          background: "rgba(251, 113, 133, 0.08)",
          border: "1px solid rgba(251, 113, 133, 0.3)",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(251, 113, 133, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <AlertTriangle size={20} color="var(--rose-400)" />
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", color: "var(--rose-400)", marginBottom: "4px" }}>
                Active Pedagogical Misconception Detected
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                <strong>{misconceptions[0].title}:</strong> {misconceptions[0].description}
              </p>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Prescribed Counter-Strategy: <code>{misconceptions[0].counter_strategy}</code>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              setSelectedStrategy(misconceptions[0].counter_strategy);
              handleLaunchSession();
            }}
            className="btn btn-sm btn-primary"
          >
            Target This Misconception
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Main Studio Launcher: Subject & Topic Selection */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "28px",
        marginBottom: "40px"
      }}>
        {/* Left Column: Subject & Topic Navigator */}
        <div className="glass-panel" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
            <BookOpen size={18} color="var(--cyan-400)" />
            1. Select Subject & Topic
          </h3>

          {/* Subject Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSubjectChange(s)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: selectedSubject?.id === s.id ? "1px solid var(--cyan-400)" : "1px solid var(--border-subtle)",
                  background: selectedSubject?.id === s.id ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  color: selectedSubject?.id === s.id ? "#ffffff" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "all 0.2s"
                }}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Topic List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "0.8rem" }}>Available Topics & Prerequisite Structure</label>
            {topics.map((t) => {
              const isSelected = selectedTopic?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopic(t)}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: isSelected ? "1px solid var(--cyan-400)" : "1px solid var(--border-subtle)",
                    background: isSelected ? "rgba(56, 189, 248, 0.1)" : "rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem", color: isSelected ? "var(--cyan-400)" : "var(--text-primary)" }}>
                      {t.name}
                    </div>
                    {t.prerequisites?.length > 0 && (
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        Requires: {t.prerequisites.map(p => p.name).join(", ")}
                      </div>
                    )}
                  </div>
                  <span className={`badge ${t.difficulty_level === "Advanced" ? "badge-rose" : t.difficulty_level === "Intermediate" ? "badge-indigo" : "badge-emerald"}`} style={{ fontSize: "0.68rem" }}>
                    {t.difficulty_level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pedagogical Mode & Strategy Configuration */}
        <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Target size={18} color="var(--indigo-400)" />
              2. Choose Learning Mode & Teaching Style
            </h3>

            {/* Learning Modes */}
            <div style={{ marginBottom: "20px" }}>
              <label>Learning Objective Mode</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "8px" }}>
                {[
                  { mode: "Learn", desc: "Foundations" },
                  { mode: "Practice", desc: "Problems" },
                  { mode: "Revise", desc: "Active Recall" },
                  { mode: "Apply", desc: "Real Scenarios" },
                  { mode: "Build", desc: "Hands-on Project" },
                  { mode: "Prepare", desc: "Exam Rubric" },
                  { mode: "Diagnose", desc: "Find Gaps" }
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setSelectedMode(item.mode)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: "10px",
                      border: selectedMode === item.mode ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                      background: selectedMode === item.mode ? "rgba(129, 140, 248, 0.15)" : "rgba(0, 0, 0, 0.2)",
                      color: selectedMode === item.mode ? "#ffffff" : "var(--text-secondary)",
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{item.mode}</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Teaching Strategy Dropdown */}
            <div style={{ marginBottom: "24px" }}>
              <label>Initial Teaching Methodology (1 of 17)</label>
              <select
                className="input-field"
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                {strategies.map((strat) => (
                  <option key={strat.name} value={strat.name}>
                    {strat.name} ({strat.badge})
                  </option>
                ))}
              </select>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px" }}>
                {strategies.find(s => s.name === selectedStrategy)?.description}
              </p>
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={handleLaunchSession}
            disabled={startingSession || !selectedTopic}
            className="btn btn-primary"
            style={{ width: "100%", padding: "16px", fontSize: "1.05rem" }}
          >
            {startingSession ? (
              "Initializing Adaptive Classroom..."
            ) : (
              <>
                <Play size={18} fill="#ffffff" />
                Launch AI Tutor for {selectedTopic?.name || "Selected Topic"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent Sessions History */}
      {recentSessions.length > 0 && (
        <div className="glass-panel" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <History size={18} color="var(--emerald-400)" />
            Recent Tutoring Sessions
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            {recentSessions.slice(0, 4).map((s) => (
              <div
                key={s.id}
                onClick={() => onResumeSession(s.id)}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: "16px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {s.subject_name} • Mode: {s.mode}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", margin: "2px 0 6px 0" }}>
                    {s.topic_name}
                  </div>
                  <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>
                    {s.current_strategy}
                  </span>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
