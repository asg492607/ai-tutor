# Aetheria — Adaptive AI Tutor Platform 🎓🧠

> **"The goal is not to give students answers. The goal is to make students understand, think, practice, apply, and independently perform."**

Aetheria is an intelligent, full-stack adaptive AI tutoring system designed around dynamic pedagogical intelligence. Unlike standard chatbots that dump answers, Aetheria models an expert human teacher: selecting from **17 distinct teaching methodologies**, diagnosing **misconceptions in mental models**, evaluating **cognitive depth (Recognition vs Understanding vs Application vs Mastery)**, and executing code in a sandboxed runtime.

---

## 🌟 Key Pillars & Features

### 1. 17 Distinct Pedagogical Methodologies
The engine dynamically chooses the optimal teaching strategy based on subject, topic, and learner state:
1. **Direct Teaching** — Clarity, structure, and foundational definitions.
2. **Socratic Teaching** — Critical inquiry that guides students to discover solutions without spoiling answers.
3. **Step-by-Step Teaching** — Procedural rigor breaking complex derivations into sequential stages.
4. **Worked Example Teaching** — Expert metacognition demonstrating internal reasoning.
5. **Feynman Teaching** — Plain-English simplicity test challenging students to teach concepts back.
6. **Analogy-Based Teaching** — Real-world physical analogies mapping abstract mechanics.
7. **Visual / Conceptual Teaching** — Spatial diagrams, geometric intuition, and concept maps.
8. **First-Principles Teaching** — Axiomatic derivation proving why formulas exist from fundamental truths.
9. **Compare-and-Contrast** — Sharpening boundaries between easily conflated ideas (e.g. *Speed vs Velocity*).
10. **Error-Based Teaching** — Isolating flawed mental models and presenting targeted counter-examples.
11. **Guided Discovery** — Scaffolded hints and eureka breadcrumbs.
12. **Practice-First Teaching** — Problem-first active learning.
13. **Simulation & Scenario** — High-stakes professional decision contexts.
14. **Project-Based Teaching** — Component synthesis toward an application.
15. **Implementation / Lab** — Hands-on execution, boundary condition tests, and debugging.
16. **Revision / Recall Teaching** — Active retrieval drills defeating the forgetting curve.
17. **Exam / Performance** — Assessment training with mark allocations and strict rubric grading.

### 2. Subject-Aware Intelligence
* **Mathematics**: Algebraic rigor, derivation tracking, LaTeX rendering ($...$).
* **Physics**: Coordinate reference frames, unit tracking, and vector vs scalar discrimination.
* **Chemistry**: Molecular mechanisms, balanced reaction kinetics, and stoichiometry.
* **Biology**: Form-fits-function, cellular cascades, and evolutionary dynamics.
* **Computer Science**: Computational complexity (Big-O), trace analysis, and live sandboxed Python execution.
* **English & Languages**: Textual evidence, syntax mechanics, and rhetorical argument synthesis.

### 3. Continuous Understanding vs Memorization Engine
* **4-Tier Cognitive Depth Tracker**: Measures **Recognition → Understanding → Application → True Mastery**.
* **Persistent Misconception Memory**: Diagnoses root errors, logs occurrence counts, and prescribes counter-pedagogies.

### 4. Interactive Learning Studio
* **Active Strategy Banner**: Real-time transparency showing which of the 17 strategies is active and its pedagogical rule.
* **Socratic Nudge Bar**: Quick triggers (*"Explain simpler"*, *"Give me a hint"*, *"Why from first principles?"*, *"Real-world analogy"*, *"Test my mastery"*).
* **Multimodal**: Built-in speech-to-text voice input and audio readout.
* **Code Lab**: Python interactive sandbox with live terminal output and execution metrics.

---

## 🛠️ Architecture & Tech Stack

* **Frontend**: React (Vite), Vanilla CSS Design System with dark obsidian aesthetics, glassmorphism, Lucide icons, Canvas Confetti.
* **Backend**: Python FastAPI, SQLAlchemy, SQLite persistence, Pydantic, Passlib (Bcrypt), Python-JOSE (JWT).
* **AI Orchestrator**: Subject-Aware Pedagogy Engine with Google Gemini integration & deterministic rule fallback.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Clone the repository
```bash
git clone https://github.com/asg492607/ai-tutor.git
cd ai-tutor
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt

# (Optional) Add your Gemini API Key:
# set GEMINI_API_KEY="your-key-here"

# Start the server:
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API runs at `http://127.0.0.1:8000`. Interactive docs at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Client runs at `http://127.0.0.1:5173`.
