import React from "react";
import { useAuth } from "../context/AuthContext";
import { 
  GraduationCap, 
  BrainCircuit, 
  LayoutDashboard, 
  MessageSquare, 
  AlertTriangle, 
  LogOut, 
  User as UserIcon,
  Sparkles
} from "lucide-react";

export default function Navbar({ activeView, setActiveView, onOpenAuth }) {
  const { user, logout } = useAuth();

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(7, 9, 14, 0.8)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-subtle)",
      padding: "12px 24px"
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView(user ? "dashboard" : "landing")}
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        >
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, var(--cyan-500) 0%, var(--indigo-500) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--glow-cyan)"
          }}>
            <BrainCircuit size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.01em" }}>
                AETHERIA
              </span>
              <span className="badge badge-cyan" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                AI TUTOR
              </span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0, lineHeight: 1 }}>
              17-Strategy Adaptive Pedagogy
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!user ? (
            <>
              <button 
                onClick={() => setActiveView("landing")}
                className={`btn btn-sm ${activeView === "landing" ? "btn-secondary" : "btn-ghost"}`}
              >
                Overview & Philosophy
              </button>
              <button 
                onClick={() => onOpenAuth("login")}
                className="btn btn-sm btn-ghost"
              >
                Sign In
              </button>
              <button 
                onClick={() => onOpenAuth("register")}
                className="btn btn-sm btn-primary"
              >
                <Sparkles size={16} />
                Get Started
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setActiveView("dashboard")}
                className={`btn btn-sm ${activeView === "dashboard" ? "btn-secondary" : "btn-ghost"}`}
                style={{ gap: "6px" }}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button 
                onClick={() => setActiveView("tutor")}
                className={`btn btn-sm ${activeView === "tutor" ? "btn-secondary" : "btn-ghost"}`}
                style={{ gap: "6px" }}
              >
                <MessageSquare size={16} />
                Classroom Studio
              </button>
              <button 
                onClick={() => setActiveView("misconceptions")}
                className={`btn btn-sm ${activeView === "misconceptions" ? "btn-secondary" : "btn-ghost"}`}
                style={{ gap: "6px" }}
              >
                <AlertTriangle size={16} color="var(--amber-400)" />
                Misconception Memory
              </button>

              {/* User profile capsule */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 14px",
                borderRadius: "30px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid var(--border-subtle)",
                marginLeft: "12px"
              }}>
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--indigo-500), var(--purple-400))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700
                }}>
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.1 }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1 }}>
                    {user.grade_level || "Scholar"}
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="btn btn-sm btn-ghost"
                  style={{ padding: "4px", marginLeft: "4px" }}
                  title="Sign Out"
                >
                  <LogOut size={16} color="var(--rose-400)" />
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
