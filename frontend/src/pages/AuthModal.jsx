import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Sparkles, LogIn, UserPlus, AlertCircle } from "lucide-react";

export default function AuthModal({ initialMode = "login", onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("Undergraduate / College");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error("Please enter your full name.");
        }
        await register(email, password, name, gradeLevel);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "rgba(3, 7, 18, 0.8)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "32px",
          position: "relative",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), var(--glow-cyan)"
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer"
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div className="badge badge-cyan" style={{ marginBottom: "10px" }}>
            <Sparkles size={12} />
            ADAPTIVE INTELLIGENCE PLATFORM
          </div>
          <h2 style={{ fontSize: "1.7rem", marginBottom: "6px" }}>
            {mode === "login" ? "Welcome Back" : "Begin Your Mastery Journey"}
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            {mode === "login"
              ? "Sign in to resume your adaptive learning sessions."
              : "Create an account to track your cognitive state across 17 teaching methods."}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div style={{
          display: "flex",
          background: "rgba(0, 0, 0, 0.4)",
          padding: "4px",
          borderRadius: "10px",
          marginBottom: "20px",
          border: "1px solid var(--border-subtle)"
        }}>
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.88rem",
              background: mode === "login" ? "rgba(56, 189, 248, 0.15)" : "transparent",
              color: mode === "login" ? "var(--cyan-400)" : "var(--text-muted)",
              transition: "all 0.2s"
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(""); }}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.88rem",
              background: mode === "register" ? "rgba(56, 189, 248, 0.15)" : "transparent",
              color: mode === "register" ? "var(--cyan-400)" : "var(--text-muted)",
              transition: "all 0.2s"
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "var(--rose-400)",
            fontSize: "0.85rem",
            marginBottom: "16px"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mode === "register" && (
            <div>
              <label>Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Marie Curie"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label>Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="scholar@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label>Current Learning Level</label>
              <select
                className="input-field"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                <option value="Middle School">Middle School (Grades 6–8)</option>
                <option value="High School (Standard)">High School (Standard)</option>
                <option value="High School (AP / IB / Advanced)">High School (AP / IB / Advanced)</option>
                <option value="Undergraduate / College">Undergraduate / College</option>
                <option value="Graduate / Professional">Graduate / Professional Scholar</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "8px", padding: "12px" }}
          >
            {loading ? (
              "Processing..."
            ) : mode === "login" ? (
              <>
                <LogIn size={18} />
                Sign In to Classroom
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Initialize Learning Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
