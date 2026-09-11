import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import TutorStudio from "./pages/TutorStudio";
import MisconceptionsView from "./pages/MisconceptionsView";
import AuthModal from "./pages/AuthModal";

function MainApp() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState("landing");
  const [authModalMode, setAuthModalMode] = useState(null); // "login", "register", or null
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Sync active view based on user auth
  useEffect(() => {
    if (!loading) {
      if (user) {
        if (activeView === "landing") {
          setActiveView("dashboard");
        }
      } else {
        if (activeView !== "landing") {
          setActiveView("landing");
        }
      }
    }
  }, [user, loading]);

  const handleStartSession = (sessionId) => {
    setActiveSessionId(sessionId);
    setActiveView("tutor");
  };

  const handleResumeSession = (sessionId) => {
    setActiveSessionId(sessionId);
    setActiveView("tutor");
  };

  const handleTargetMisconception = (misconception) => {
    // Navigate to dashboard to pick topic and mode
    setActiveView("dashboard");
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-dark)"
      }}>
        <div className="badge badge-cyan pulse-glow" style={{ padding: "10px 20px" }}>
          Initializing Aetheria Adaptive AI Tutor Engine...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
      />

      <main style={{ flex: 1 }}>
        {activeView === "landing" && (
          <LandingPage
            onGetStarted={() => {
              if (user) {
                setActiveView("dashboard");
              } else {
                setAuthModalMode("register");
              }
            }}
          />
        )}

        {activeView === "dashboard" && user && (
          <Dashboard
            onStartSession={handleStartSession}
            onResumeSession={handleResumeSession}
          />
        )}

        {activeView === "tutor" && user && activeSessionId && (
          <TutorStudio
            sessionId={activeSessionId}
            onBackToDashboard={() => setActiveView("dashboard")}
          />
        )}

        {activeView === "misconceptions" && user && (
          <MisconceptionsView
            onTargetMisconception={handleTargetMisconception}
          />
        )}
      </main>

      {/* Global Auth Modal */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSuccess={() => {
            setAuthModalMode(null);
            setActiveView("dashboard");
          }}
        />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "rgba(7, 9, 14, 0.9)",
        padding: "24px 0",
        textAlign: "center",
        fontSize: "0.82rem",
        color: "var(--text-muted)"
      }}>
        <div className="container">
          <p>
            <strong>Aetheria AI Tutor</strong> — Adaptive Pedagogy with 17 Teaching Methodologies & Subject-Aware Intelligence.
          </p>
          <p style={{ marginTop: "4px", fontSize: "0.75rem" }}>
            Real-time Cognitive Mastery Tracking • Socratic Guidance • Safe Execution Sandbox
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
