import React, { useState } from "react";
import { 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Compass, 
  Lightbulb, 
  Activity, 
  Flame, 
  HelpCircle, 
  Target, 
  Workflow, 
  TrendingUp,
  Cpu,
  BookOpen,
  Atom,
  Sigma,
  FlaskConical,
  Dna,
  Code2,
  Feather
} from "lucide-react";

export default function LandingPage({ onGetStarted }) {
  const [selectedStrategy, setSelectedStrategy] = useState(1); // Socratic by default

  const strategies = [
    {
      id: 0,
      name: "Direct Teaching",
      tag: "Clarity & Structure",
      desc: "Explains concepts clearly and systematically. Ideal when a student has zero prior foundational knowledge.",
      example: "Clear formal definitions, core axioms, and structured breakdown without distracting jargon."
    },
    {
      id: 1,
      name: "Socratic Teaching",
      tag: "Critical Inquiry",
      desc: "Asks carefully chosen questions that make the student reason toward the answer rather than receiving it passively.",
      example: "Tutor: 'What connects your given forces?' -> Student ponders -> Tutor: 'Look at the units—what does that tell you?'"
    },
    {
      id: 2,
      name: "Step-by-Step Teaching",
      tag: "Procedural Rigor",
      desc: "Breaks complex problems into discrete logical stages, proving why Step 2 inevitably follows Step 1.",
      example: "Stage 1: Declare coordinate frame -> Stage 2: Free body diagram -> Stage 3: Algebraic equation."
    },
    {
      id: 3,
      name: "Worked Example Teaching",
      tag: "Expert Metacognition",
      desc: "Demonstrates a complete problem, vocalizing how a master thinks through roadblocks and edge cases.",
      example: "Shows expert inner dialogue: 'Here is why I factor before dividing, avoiding the zero-division trap.'"
    },
    {
      id: 4,
      name: "Feynman Teaching",
      tag: "Plain English Test",
      desc: "Explains difficult concepts using simple language, then challenges the student to explain it back.",
      example: "Explaining recursion as Russian nesting dolls, then asking: 'How would you teach this to a 10-year old?'"
    },
    {
      id: 5,
      name: "Analogy-Based Teaching",
      tag: "Intuition Bridge",
      desc: "Bridges abstract mechanics to familiar real-world phenomena, clearly noting where analogies succeed and fail.",
      example: "Electrical voltage as water pressure in a pipe; RAM as desktop workspace vs Hard Drive as filing cabinet."
    },
    {
      id: 6,
      name: "Visual / Conceptual Teaching",
      tag: "Spatial Geometry",
      desc: "Prioritizes diagrams, concept graphs, coordinate relations, and spatial representations.",
      example: "Calculus integration visualized as Riemann accumulation of micro-rectangles under a parabolic curve."
    },
    {
      id: 7,
      name: "First-Principles Teaching",
      tag: "Axiomatic Derivation",
      desc: "Starts from ground-truth fundamentals and derives formulas, proving why they exist instead of memorizing them.",
      example: "Deriving $E_k = \\frac{1}{2}mv^2$ from the work-energy integral $\\int F dx = \\int m\\frac{dv}{dt} v dt$."
    },
    {
      id: 8,
      name: "Compare-and-Contrast",
      tag: "Boundary Discrimination",
      desc: "Juxtaposes easily conflated concepts side by side to sharpen mental boundaries.",
      example: "Speed vs Velocity; Compiler vs Interpreter; Mass vs Weight; Mutation vs Adaptation."
    },
    {
      id: 9,
      name: "Error-Based Teaching",
      tag: "Misconception Diagnosis",
      desc: "Transforms student mistakes into high-leverage learning data by isolating flawed mental models.",
      example: "Diagnosing when a student equates Velocity with Distance/Time, presenting an oval track counter-example."
    },
    {
      id: 10,
      name: "Guided Discovery",
      tag: "Eureka Scaffolding",
      desc: "Provides layered hints and subtle breadcrumbs so the student experiences genuine discovery.",
      example: "Progressive hints: Level 1 (nudge) -> Level 2 (structural hint) -> Level 3 (guiding principle)."
    },
    {
      id: 11,
      name: "Practice-First Teaching",
      tag: "Immediate Action",
      desc: "Bypasses long lectures by introducing a challenge problem upfront, teaching theory through the student's attempt.",
      example: "'Try balancing this chemical equation right now with your current intuition—we will extract the laws together.'"
    },
    {
      id: 12,
      name: "Simulation & Scenario",
      tag: "Real-World Stakes",
      desc: "Places the student in realistic professional situations where decisions carry concrete consequences.",
      example: "'You are the flight engineer on Artemis III. Orbital telemetry shows an angular drift. What do you inspect first?'"
    },
    {
      id: 13,
      name: "Project-Based Teaching",
      tag: "Synthesis & Craft",
      desc: "Teaches individual concepts as interlocking building blocks toward an impressive finished artifact.",
      example: "Learning data structures while building an actual in-memory search index."
    },
    {
      id: 14,
      name: "Implementation / Lab",
      tag: "Hands-On Execution",
      desc: "Turns theory into live execution with compiler output, test assertions, and boundary-condition stress tests.",
      example: "Writing Python functions inside the built-in sandbox, running test cases, and inspecting stack traces."
    },
    {
      id: 15,
      name: "Revision / Recall Teaching",
      tag: "Active Retrieval",
      desc: "Uses active retrieval drills and spaced reinforcement to defeat the Ebbinghaus forgetting curve.",
      example: "Rapid retrieval prompts without looking at notes to solidify synaptic pathways."
    },
    {
      id: 16,
      name: "Exam / Performance",
      tag: "Assessment Rubric",
      desc: "Trains under formal timed examination formats with strict mark allocation and official grading rubrics.",
      example: "'[6 Marks] Solve within 7 minutes. Marking criteria: 2 marks for boundary setup, 3 for integration, 1 for units.'"
    }
  ];

  const subjects = [
    { icon: Sigma, name: "Mathematics", color: "#38bdf8", focus: "Derivations, algebraic rigor, calculus intuition" },
    { icon: Atom, name: "Physics", color: "#818cf8", focus: "Vector kinematics, conservation laws, free-body diagrams" },
    { icon: FlaskConical, name: "Chemistry", color: "#34d399", focus: "Molecular bonds, stoichiometry, equilibrium dynamics" },
    { icon: Dna, name: "Biology", color: "#f472b6", focus: "Cellular pathways, genetic mechanisms, evolutionary systems" },
    { icon: Code2, name: "Computer Science", color: "#fb923c", focus: "Algorithmic logic, data structures, live sandbox execution" },
    { icon: Feather, name: "English & Writing", color: "#a78bfa", focus: "Textual rhetoric, argumentation, syntactical precision" },
  ];

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* Hero Section */}
      <section style={{
        padding: "80px 0 60px 0",
        textAlign: "center",
        position: "relative"
      }}>
        <div className="container">
          <div className="badge badge-cyan pulse-glow" style={{ marginBottom: "20px" }}>
            <Sparkles size={14} />
            BEYOND CHATBOTS: TRUE ADAPTIVE PEDAGOGY
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
            lineHeight: 1.15,
            maxWidth: "960px",
            margin: "0 auto 24px auto"
          }}>
            The AI That Teaches You to <span className="gradient-text">Think</span> — Not Just Gives Answers.
          </h1>

          <p style={{
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            color: "var(--text-secondary)",
            maxWidth: "780px",
            margin: "0 auto 36px auto",
            lineHeight: 1.6
          }}>
            General-purpose AI chatbots produce the illusion of learning by dumping solutions. 
            <strong> Aetheria AI Tutor</strong> dynamically orchestrates <strong>17 distinct teaching methodologies</strong> to 
            diagnose your misconceptions, scaffold your reasoning, and guide you from basic intuition to independent mastery.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
            <button 
              onClick={onGetStarted}
              className="btn btn-primary"
              style={{ padding: "14px 28px", fontSize: "1.05rem" }}
            >
              Start Tutoring Session
              <ArrowRight size={20} />
            </button>
            <a 
              href="#methodologies"
              className="btn btn-secondary"
              style={{ padding: "14px 24px", fontSize: "1.05rem" }}
            >
              Explore 17 Methodologies
            </a>
          </div>

          {/* Core Learning Cycle Pill Ribbon */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "40px",
            padding: "8px 16px",
            maxWidth: "100%",
            overflowX: "auto"
          }}>
            <span style={{ fontSize: "0.75rem", color: "var(--cyan-400)", fontWeight: 700, textTransform: "uppercase" }}>
              The Learning Loop:
            </span>
            {["Understand", "Demonstrate", "Attempt", "Diagnose", "Apply", "Master"].map((step, idx, arr) => (
              <React.Fragment key={step}>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {step}
                </span>
                {idx < arr.length - 1 && (
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section: ChatGPT vs Aetheria AI Tutor */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "2.2rem", marginBottom: "12px" }}>
              Why Ordinary AI Chatbots <span className="gradient-text-purple">Fail at Tutoring</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              A chatbot optimizes for giving you the immediate answer. An intelligent tutor optimizes for your long-term cognitive mastery.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px"
          }}>
            {/* Ordinary AI Chatbot */}
            <div className="glass-panel" style={{ padding: "32px", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
              <div className="badge badge-rose" style={{ marginBottom: "16px" }}>
                Generic AI Assistant (ChatGPT)
              </div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "14px", color: "var(--rose-400)" }}>
                The "Answer Machine" Trap
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px", color: "var(--text-secondary)", fontSize: "0.92rem" }}>
                <li style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "var(--rose-400)", fontWeight: "bold" }}>✕</span>
                  <span><strong>Instant Solution:</strong> Solves the math problem immediately, depriving you of productive struggle.</span>
                </li>
                <li style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "var(--rose-400)", fontWeight: "bold" }}>✕</span>
                  <span><strong>Monolithic Prompting:</strong> Teaches French, Calculus, and Python with the exact same conversational tone.</span>
                </li>
                <li style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "var(--rose-400)", fontWeight: "bold" }}>✕</span>
                  <span><strong>Accepts "I Understand":</strong> Takes passive nodding at face value without verifying reasoning.</span>
                </li>
                <li style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "var(--rose-400)", fontWeight: "bold" }}>✕</span>
                  <span><strong>Forgets Misconceptions:</strong> Errors vanish into chat scroll without logging your cognitive blindspots.</span>
                </li>
              </ul>
            </div>

            {/* Aetheria AI Tutor */}
            <div className="glass-panel" style={{ padding: "32px", border: "1px solid rgba(56, 189, 248, 0.4)", boxShadow: "var(--glow-cyan)" }}>
              <div className="badge badge-cyan" style={{ marginBottom: "16px" }}>
                Aetheria Adaptive Tutor
              </div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "14px", color: "var(--cyan-400)" }}>
                The "Cognitive Master" Engine
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px", color: "var(--text-secondary)", fontSize: "0.92rem" }}>
                <li style={{ display: "flex", gap: "10px" }}>
                  <CheckCircle2 size={18} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
                  <span><strong>Socratic Guidance:</strong> Refuses to surrender the final answer. Asks the incisive question that triggers the eureka moment.</span>
                </li>
                <li style={{ display: "flex", gap: "10px" }}>
                  <CheckCircle2 size={18} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
                  <span><strong>17 Dynamic Pedagogies:</strong> Fluently transitions between First-Principles, Analogy, Feynman, and Lab Execution.</span>
                </li>
                <li style={{ display: "flex", gap: "10px" }}>
                  <CheckCircle2 size={18} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
                  <span><strong>Cognitive Depth Tracker:</strong> Continuously measures Recognition vs Understanding vs Application vs Mastery.</span>
                </li>
                <li style={{ display: "flex", gap: "10px" }}>
                  <CheckCircle2 size={18} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
                  <span><strong>Persistent Misconception Memory:</strong> Detects vector vs scalar confusion and constructs targeted counter-examples.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 17 Teaching Methodologies Interactive Grid */}
      <section id="methodologies" style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="badge badge-indigo" style={{ marginBottom: "12px" }}>
              PEDAGOGICAL ENGINE
            </div>
            <h2 style={{ fontSize: "2.3rem", marginBottom: "12px" }}>
              The 17 Adaptive Teaching Methodologies
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "680px", margin: "0 auto" }}>
              Great teachers don't use one strategy for everything. The engine dynamically chooses the optimal pedagogical posture for the exact topic, subject, and student mental state.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px"
          }}>
            {strategies.map((strat) => (
              <div 
                key={strat.id}
                onClick={() => setSelectedStrategy(strat.id)}
                className={`glass-panel glass-panel-hover ${selectedStrategy === strat.id ? "active-strat" : ""}`}
                style={{
                  padding: "24px",
                  cursor: "pointer",
                  borderColor: selectedStrategy === strat.id ? "var(--cyan-400)" : "var(--border-subtle)",
                  boxShadow: selectedStrategy === strat.id ? "var(--glow-cyan)" : "var(--shadow-card)",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>
                    #{strat.id + 1} {strat.tag}
                  </span>
                </div>
                <h4 style={{ fontSize: "1.15rem", marginBottom: "8px" }}>
                  {strat.name}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: 1.5 }}>
                  {strat.desc}
                </p>
                <div style={{
                  padding: "10px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.3)",
                  fontSize: "0.78rem",
                  color: "var(--cyan-400)",
                  fontFamily: "var(--font-mono)",
                  border: "1px solid rgba(255, 255, 255, 0.04)"
                }}>
                  💡 {strat.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject-Aware Intelligence */}
      <section style={{ padding: "60px 0", background: "rgba(10, 15, 28, 0.5)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "2.2rem", marginBottom: "12px" }}>
              Subject-Aware Intelligence Layer
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "640px", margin: "0 auto" }}>
              Math requires rigorous derivations; Physics demands coordinate systems & unit tracking; Programming demands runnable code and test case tracing.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            {subjects.map((subj) => {
              const Icon = subj.icon;
              return (
                <div key={subj.name} className="glass-panel" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                    <div style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `rgba(255, 255, 255, 0.05)`,
                      border: `1px solid ${subj.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Icon size={22} color={subj.color} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1.1rem" }}>{subj.name}</h4>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Specialized Engine</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {subj.focus}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4-Tier Cognitive Mastery Pyramid */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="glass-panel" style={{
            padding: "48px 32px",
            border: "1px solid rgba(129, 140, 248, 0.3)",
            textAlign: "center"
          }}>
            <h2 style={{ fontSize: "2.2rem", marginBottom: "16px" }}>
              How the Tutor Evaluates True Mastery
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 36px auto" }}>
              Saying "I understand" is not enough. The tutor measures your cognitive depth across four progressive layers:
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px"
            }}>
              <div style={{ padding: "20px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)" }}>
                <div className="badge badge-indigo" style={{ marginBottom: "10px" }}>Level 1</div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>Recognition</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>"I have seen this formula or concept before."</p>
              </div>
              <div style={{ padding: "20px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)" }}>
                <div className="badge badge-cyan" style={{ marginBottom: "10px" }}>Level 2</div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>Understanding</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>"I can explain why it works in plain language."</p>
              </div>
              <div style={{ padding: "20px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)" }}>
                <div className="badge badge-emerald" style={{ marginBottom: "10px" }}>Level 3</div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>Application</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>"I can solve realistic problems with minimal hints."</p>
              </div>
              <div style={{ padding: "20px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)" }}>
                <div className="badge badge-amber" style={{ marginBottom: "10px" }}>Level 4</div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>Mastery</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>"I can independently solve novel problems and debug errors."</p>
              </div>
            </div>

            <button 
              onClick={onGetStarted}
              className="btn btn-primary"
              style={{ marginTop: "36px", padding: "14px 32px", fontSize: "1.05rem" }}
            >
              Enter Classroom Now
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
