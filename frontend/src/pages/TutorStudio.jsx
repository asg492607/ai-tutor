import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { 
  Send, 
  Lightbulb, 
  HelpCircle, 
  RefreshCw, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Code2, 
  Terminal, 
  Play, 
  AlertTriangle, 
  BrainCircuit, 
  Sparkles, 
  Layers, 
  ArrowLeft,
  Settings,
  CheckCircle,
  Clock
} from "lucide-react";
import confetti from "canvas-confetti";

export default function TutorStudio({ sessionId, onBackToDashboard }) {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState([]);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" or "code"
  
  // Code Lab State
  const [code, setCode] = useState(
    `# Interactive Python Sandbox\n# Write your code or implementation below:\n\ndef calculate_displacement(x1, x2):\n    return x2 - x1\n\nprint("Result:", calculate_displacement(0, 10))`
  );
  const [codeOutput, setCodeOutput] = useState(null);
  const [runningCode, setRunningCode] = useState(false);

  // Audio / Speech State
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadSession();
    loadStrategies();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSession = async () => {
    try {
      const data = await api.tutor.getSession(sessionId);
      setSession(data);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load session:", err);
    }
  };

  const loadStrategies = async () => {
    try {
      const strats = await api.curriculum.getStrategies();
      setStrategies(strats);
    } catch (err) {
      console.error("Failed to load strategies:", err);
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setInput("");
    setLoading(true);

    // Optimistic student message
    const tempStudentMsg = {
      id: Date.now(),
      sender: "student",
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempStudentMsg]);

    try {
      const res = await api.tutor.sendMessage(sessionId, text);
      setMessages(prev => [...prev, res.message]);
      
      // Update session strategy if transitioned
      if (res.current_strategy) {
        setSession(prev => ({
          ...prev,
          current_strategy: res.current_strategy,
          mastery: res.updated_mastery
        }));
      }

      // If user achieved high mastery, celebrate with confetti
      if (res.updated_mastery?.mastery_score >= 80) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestHint = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.tutor.requestHint(sessionId);
      setMessages(prev => [...prev, res.message]);
    } catch (err) {
      console.error("Failed to request hint:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStrategy = async (strategyName) => {
    try {
      await api.tutor.changeStrategy(sessionId, strategyName);
      setSession(prev => ({ ...prev, current_strategy: strategyName }));
      setShowStrategyModal(false);
      // Reload session to get system announcement message
      loadSession();
    } catch (err) {
      console.error("Failed to change strategy:", err);
    }
  };

  const handleRunCode = async () => {
    setRunningCode(true);
    try {
      const res = await api.sandbox.executeCode(code, "python");
      setCodeOutput(res);
    } catch (err) {
      setCodeOutput({
        stdout: "",
        stderr: err.message || "Execution failed",
        exit_code: 1,
        execution_time_ms: 0
      });
    } finally {
      setRunningCode(false);
    }
  };

  // Speech Recognition (Microphone)
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.start();
  };

  // Text to Speech Readout
  const toggleSpeechSynthesis = (msgId, text) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`$]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  if (!session) {
    return (
      <div style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="badge badge-cyan pulse-glow">Loading Adaptive Classroom...</div>
      </div>
    );
  }

  const activeStratInfo = strategies.find(s => s.name === session.current_strategy) || {
    name: session.current_strategy,
    badge: "Active",
    description: "Tailored pedagogical instruction",
    rule: "Guidance with adaptive feedback"
  };

  return (
    <div className="container" style={{ padding: "20px 24px 60px 24px", maxWidth: "1200px" }}>
      {/* Studio Top Navigation Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button 
            onClick={onBackToDashboard}
            className="btn btn-sm btn-secondary"
            style={{ padding: "8px 12px" }}
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "1.3rem" }}>{session.topic.name}</h2>
              <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>
                {session.subject.name}
              </span>
              <span className="badge badge-indigo" style={{ fontSize: "0.68rem" }}>
                Mode: {session.mode}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher (Chat vs Code Lab for CS) */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {session.subject.slug === "programming" && (
            <div style={{
              display: "flex",
              background: "rgba(0, 0, 0, 0.4)",
              padding: "3px",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)"
            }}>
              <button
                onClick={() => setActiveTab("chat")}
                className={`btn btn-sm ${activeTab === "chat" ? "btn-secondary" : "btn-ghost"}`}
                style={{ padding: "4px 10px", fontSize: "0.8rem" }}
              >
                Tutor Dialogue
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`btn btn-sm ${activeTab === "code" ? "btn-secondary" : "btn-ghost"}`}
                style={{ padding: "4px 10px", fontSize: "0.8rem", gap: "4px" }}
              >
                <Code2 size={14} />
                Code Lab
              </button>
            </div>
          )}

          {/* Current Strategy Switcher Button */}
          <button
            onClick={() => setShowStrategyModal(true)}
            className="btn btn-sm btn-secondary"
            style={{ border: "1px solid var(--border-focus)", gap: "6px" }}
          >
            <Settings size={14} color="var(--cyan-400)" />
            <span>Strategy: <strong>{session.current_strategy}</strong></span>
          </button>
        </div>
      </div>

      {/* Active Pedagogical Strategy Banner */}
      <div style={{
        background: "linear-gradient(90deg, rgba(14, 165, 233, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)",
        border: "1px solid rgba(56, 189, 248, 0.3)",
        borderRadius: "14px",
        padding: "14px 20px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(56, 189, 248, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(56, 189, 248, 0.3)"
          }}>
            <BrainCircuit size={20} color="var(--cyan-400)" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                {activeStratInfo.name}
              </span>
              <span className="badge badge-cyan" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                {activeStratInfo.badge}
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
              {activeStratInfo.rule}
            </p>
          </div>
        </div>

        {/* Mini Cognitive State Capsule */}
        <div style={{ display: "flex", gap: "14px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <span>Und: <strong style={{ color: "var(--cyan-400)" }}>{session.mastery?.understanding || 10}%</strong></span>
          <span>App: <strong style={{ color: "var(--emerald-400)" }}>{session.mastery?.application || 0}%</strong></span>
          <span>Mas: <strong style={{ color: "var(--amber-400)" }}>{session.mastery?.mastery || 0}%</strong></span>
        </div>
      </div>

      {/* Main Workspace (Dialogue or Code Lab) */}
      {activeTab === "chat" ? (
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 280px)", minHeight: "520px" }}>
          {/* Chat Messages Timeline */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
            {messages.map((m) => {
              const isStudent = m.sender === "student";
              const isSystem = m.sender === "system";

              if (isSystem) {
                return (
                  <div key={m.id} style={{
                    alignSelf: "center",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    maxWidth: "80%",
                    textAlign: "center"
                  }}>
                    {m.content}
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isStudent ? "flex-end" : "flex-start",
                    maxWidth: isStudent ? "75%" : "85%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isStudent ? "flex-end" : "flex-start"
                  }}
                >
                  {/* Sender Metadata Badge */}
                  {!isStudent && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span className="badge badge-cyan" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                        {m.strategy_used || session.current_strategy}
                      </span>
                      {m.cognitive_level && (
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          Level: {m.cognitive_level}
                        </span>
                      )}
                      <button
                        onClick={() => toggleSpeechSynthesis(m.id, m.content)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: speakingMsgId === m.id ? "var(--cyan-400)" : "var(--text-muted)" }}
                        title="Read aloud"
                      >
                        {speakingMsgId === m.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    style={{
                      padding: "16px 20px",
                      borderRadius: isStudent ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: isStudent 
                        ? "linear-gradient(135deg, var(--indigo-500) 0%, var(--cyan-500) 100%)"
                        : "rgba(18, 24, 38, 0.9)",
                      border: isStudent ? "none" : "1px solid var(--border-subtle)",
                      color: "#ffffff",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      boxShadow: isStudent ? "0 4px 15px rgba(99, 102, 241, 0.25)" : "var(--shadow-card)",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {m.content}
                  </div>

                  {/* Misconception notification attached to tutor response if detected */}
                  {m.misconception_detected && (
                    <div style={{
                      marginTop: "6px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: "rgba(251, 113, 133, 0.15)",
                      border: "1px solid rgba(251, 113, 133, 0.3)",
                      fontSize: "0.75rem",
                      color: "var(--rose-400)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <AlertTriangle size={12} />
                      Misconception Diagnosed: <strong>{m.misconception_detected}</strong>
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", padding: "12px 18px" }}>
                <div className="badge badge-cyan pulse-glow" style={{ fontSize: "0.75rem" }}>
                  AI Tutor analyzing cognitive reasoning...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Socratic Quick-Action Nudges */}
          <div style={{
            padding: "8px 16px",
            background: "rgba(10, 15, 28, 0.5)",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            whiteSpace: "nowrap"
          }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center", marginRight: "4px" }}>
              Nudges:
            </span>
            <button
              onClick={handleRequestHint}
              disabled={loading}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: "0.78rem", padding: "4px 10px" }}
            >
              💡 Give me a hint
            </button>
            <button
              onClick={() => handleSendMessage("Explain this simpler, like Feynman style")}
              disabled={loading}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: "0.78rem", padding: "4px 10px" }}
            >
              🔍 Explain simpler
            </button>
            <button
              onClick={() => handleSendMessage("Why does this work from first principles?")}
              disabled={loading}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: "0.78rem", padding: "4px 10px" }}
            >
              ⚛️ Why from first principles?
            </button>
            <button
              onClick={() => handleSendMessage("Can you give me a real-world analogy for this?")}
              disabled={loading}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: "0.78rem", padding: "4px 10px" }}
            >
              🌐 Real-world analogy
            </button>
            <button
              onClick={() => handleSendMessage("Give me a challenging problem to test my mastery")}
              disabled={loading}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: "0.78rem", padding: "4px 10px" }}
            >
              ⚡ Test my mastery
            </button>
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: "16px 20px",
              background: "rgba(15, 23, 42, 0.8)",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            {/* Mic Speech Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className="btn btn-secondary"
              style={{
                padding: "10px",
                borderRadius: "10px",
                color: isListening ? "var(--rose-400)" : "var(--text-secondary)",
                borderColor: isListening ? "var(--rose-400)" : "var(--border-subtle)"
              }}
              title={isListening ? "Listening... click to stop" : "Speak to Tutor (Voice Input)"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              className="input-field"
              placeholder="Ask a question, write your step-by-step reasoning, or propose an answer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{ flex: 1 }}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: "10px 18px" }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        /* Programming Code Lab Studio */
        <div className="glass-panel" style={{ padding: "24px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px", height: "calc(100vh - 280px)" }}>
          {/* Code Editor */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--cyan-400)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Code2 size={16} />
                Python Interactive Editor
              </span>
              <button
                onClick={handleRunCode}
                disabled={runningCode}
                className="btn btn-sm btn-primary"
                style={{ gap: "6px" }}
              >
                <Play size={14} fill="#ffffff" />
                {runningCode ? "Running..." : "Run Code"}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                flex: 1,
                background: "#050811",
                color: "#f8fafc",
                fontFamily: "var(--font-mono)",
                fontSize: "0.9rem",
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                resize: "none",
                outline: "none"
              }}
            />
          </div>

          {/* Terminal Output */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Terminal size={16} />
                Execution Sandbox Terminal
              </span>
              {codeOutput && (
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Exit: {codeOutput.exit_code} • {codeOutput.execution_time_ms}ms
                </span>
              )}
            </div>
            <div style={{
              flex: 1,
              background: "#03060c",
              border: "1px solid var(--border-subtle)",
              borderRadius: "10px",
              padding: "16px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              overflowY: "auto",
              color: codeOutput?.exit_code === 0 ? "var(--emerald-400)" : "var(--rose-400)"
            }}>
              {codeOutput ? (
                <>
                  {codeOutput.stdout && <pre style={{ color: "#e2e8f0" }}>{codeOutput.stdout}</pre>}
                  {codeOutput.stderr && <pre style={{ color: "var(--rose-400)" }}>{codeOutput.stderr}</pre>}
                </>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>
                  Click "Run Code" to execute script and inspect output or stack traces.
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setActiveTab("chat");
                handleSendMessage(`Here is my code implementation:\n\`\`\`python\n${code}\n\`\`\`\nPlease review my logic and test cases.`);
              }}
              className="btn btn-secondary"
              style={{ marginTop: "12px", width: "100%" }}
            >
              Send Code to AI Tutor for Pedagogical Review
            </button>
          </div>
        </div>
      )}

      {/* 17 Strategies Switcher Modal */}
      {showStrategyModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 150,
          background: "rgba(3, 7, 18, 0.8)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "780px", maxHeight: "85vh", overflowY: "auto", padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "1.4rem" }}>Switch Teaching Methodology</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Choose from the 17 specialized pedagogical frameworks to change how the tutor responds.
                </p>
              </div>
              <button onClick={() => setShowStrategyModal(false)} className="btn btn-sm btn-ghost">
                Close
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {strategies.map((strat) => {
                const isCurrent = strat.name === session.current_strategy;
                return (
                  <div
                    key={strat.name}
                    onClick={() => handleChangeStrategy(strat.name)}
                    style={{
                      padding: "14px",
                      borderRadius: "10px",
                      border: isCurrent ? "1px solid var(--cyan-400)" : "1px solid var(--border-subtle)",
                      background: isCurrent ? "rgba(56, 189, 248, 0.15)" : "rgba(0, 0, 0, 0.3)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "0.9rem", color: isCurrent ? "var(--cyan-400)" : "#ffffff" }}>
                        {strat.name}
                      </strong>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0 }}>
                      {strat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
