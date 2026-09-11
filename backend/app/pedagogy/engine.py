"""
The Core Pedagogical Engine for the Adaptive AI Tutor.
Coordinates subject intelligence, the 17 teaching strategies, cognitive mastery evaluation,
misconception detection, and LLM orchestration (Gemini API with intelligent fallback).
"""

import os
import json
import logging
from typing import Dict, Any, List, Optional, Tuple
from app.core.config import settings
from app.pedagogy.strategies import TEACHING_STRATEGIES
from app.pedagogy.subjects import SUBJECT_INTELLIGENCE

logger = logging.getLogger(__name__)

# Try importing google-genai
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


class PedagogicalEngine:
    def __init__(self):
        self.client = None
        if GENAI_AVAILABLE and settings.GEMINI_API_KEY:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini Client: {e}")

    def evaluate_cognitive_progress(
        self,
        student_input: str,
        current_strategy: str,
        current_mastery: Dict[str, float],
        topic_name: str,
        subject_slug: str
    ) -> Tuple[Dict[str, float], Optional[Dict[str, str]], str, str]:
        """
        Evaluates student response to determine:
        1. Updated mastery scores (recognition, understanding, application, mastery, overall)
        2. Detected misconception (if any)
        3. Cognitive level demonstrated (Recognition, Understanding, Application, Mastery)
        4. Next recommended strategy
        """
        text_lower = student_input.lower().strip()
        misconception = None
        cognitive_level = "Understanding"
        next_strategy = current_strategy

        # Clone current scores
        rec = current_mastery.get("recognition_score", 10.0)
        und = current_mastery.get("understanding_score", 10.0)
        app = current_mastery.get("application_score", 0.0)
        mas = current_mastery.get("mastery_score", 0.0)

        # 1. Misconception Pattern Matching
        if subject_slug == "physics" and ("velocity = distance" in text_lower or "velocity is distance / time" in text_lower or "v = d/t" in text_lower):
            misconception = {
                "title": "Scalar Distance vs Vector Displacement Confusion",
                "description": "Student is equating velocity (vector) with distance/time instead of displacement/time.",
                "counter_strategy": "Compare-and-Contrast Teaching"
            }
            next_strategy = "Error-Based Teaching"
            und = max(15.0, und - 5.0)

        elif subject_slug == "mathematics" and ("(x+2)/2 = x+1" in text_lower or "(x+2)/2 = x + 1" in text_lower or "cancel the 2" in text_lower):
            misconception = {
                "title": "Illegal Term Cancellation Across Addition",
                "description": "Student is cancelling terms across an addition instead of factoring first.",
                "counter_strategy": "First-Principles Teaching"
            }
            next_strategy = "Error-Based Teaching"
            und = max(10.0, und - 5.0)

        elif subject_slug == "programming" and ("=" in text_lower and "if " in text_lower and "==" not in text_lower):
            misconception = {
                "title": "Assignment vs Equality Operator Confusion",
                "description": "Student is using single '=' inside an if condition instead of comparison '=='.",
                "counter_strategy": "Implementation / Lab Teaching"
            }
            next_strategy = "Error-Based Teaching"

        # 2. Student Intentions & Strategy Transitions
        if any(w in text_lower for w in ["why does this work", "why is this formula", "prove this", "derive this", "where does this come from"]):
            next_strategy = "First-Principles Teaching"
            cognitive_level = "Understanding"
            und = min(100.0, und + 10.0)

        elif any(w in text_lower for w in ["give me a hint", "hint please", "im stuck", "i don't know where to start", "help me"]):
            next_strategy = "Guided Discovery"
            cognitive_level = "Application"
            app = max(5.0, app - 2.0)  # Hint dependency slightly tempers raw independence

        elif any(w in text_lower for w in ["explain simpler", "like i am 10", "too complex", "explain easily", "in simple terms"]):
            next_strategy = "Feynman Teaching"
            cognitive_level = "Recognition"

        elif any(w in text_lower for w in ["real world", "analogy", "how is this used in real life", "practical use"]):
            next_strategy = "Analogy-Based Teaching"
            cognitive_level = "Understanding"
            und = min(100.0, und + 8.0)

        elif any(w in text_lower for w in ["test me", "give me a problem", "harder question", "quiz me", "exam question"]):
            next_strategy = "Exam / Performance Teaching"
            cognitive_level = "Mastery"
            rec = min(100.0, rec + 15.0)

        elif any(w in text_lower for w in ["step by step", "break it down", "stages"]):
            next_strategy = "Step-by-Step Teaching"

        elif any(w in text_lower for w in ["show me an example", "worked example", "demonstrate"]):
            next_strategy = "Worked Example Teaching"

        # 3. Assess reasoning depth if substantive answer
        if len(text_lower) > 50 and not misconception:
            # Substantial, thoughtful student response
            rec = min(100.0, rec + 12.0)
            und = min(100.0, und + 15.0)
            app = min(100.0, app + 14.0)
            if und > 70.0 and app > 60.0:
                mas = min(100.0, mas + 10.0)
                cognitive_level = "Mastery"
            else:
                cognitive_level = "Application"

        overall = round((rec * 0.15) + (und * 0.35) + (app * 0.30) + (mas * 0.20), 1)
        updated_mastery = {
            "recognition_score": round(rec, 1),
            "understanding_score": round(und, 1),
            "application_score": round(app, 1),
            "mastery_score": round(mas, 1),
            "overall_score": overall
        }

        return updated_mastery, misconception, cognitive_level, next_strategy

    def generate_response(
        self,
        subject_slug: str,
        topic_name: str,
        current_strategy: str,
        student_input: str,
        history: List[Dict[str, str]],
        mastery_stats: Dict[str, float],
        active_misconceptions: List[str]
    ) -> Dict[str, Any]:
        """
        Generates the tutor's adaptive pedagogical response.
        Enforces:
        - Subject-specific intelligence
        - 17 teaching methodologies rules
        - Metacognitive transparency (why this strategy was chosen)
        """
        strat_info = TEACHING_STRATEGIES.get(current_strategy, TEACHING_STRATEGIES["Socratic Teaching"])
        subj_info = SUBJECT_INTELLIGENCE.get(subject_slug, SUBJECT_INTELLIGENCE["mathematics"])

        # Try live Gemini API if available and configured
        if self.client:
            try:
                system_prompt = self._build_system_prompt(subj_info, strat_info, topic_name, mastery_stats, active_misconceptions)
                gemini_contents = []
                for msg in history[-6:]:
                    role = "user" if msg.get("sender") == "student" else "model"
                    gemini_contents.append({"role": role, "parts": [{"text": msg.get("content", "")}]})
                
                gemini_contents.append({"role": "user", "parts": [{"text": student_input}]})

                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=gemini_contents,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        temperature=0.7,
                        max_output_tokens=1000
                    )
                )
                if response and response.text:
                    return {
                        "content": response.text,
                        "strategy_used": strat_info["name"],
                        "strategy_badge": strat_info["badge"],
                        "strategy_reason": f"Active Mode: {strat_info['name']} — {strat_info['description']}"
                    }
            except Exception as err:
                logger.error(f"Gemini generation error: {err}. Falling back to pedagogical rule engine.")

        # Deterministic Expert Fallback Engine
        return self._generate_pedagogical_fallback(
            subject_slug=subject_slug,
            topic_name=topic_name,
            strat_info=strat_info,
            student_input=student_input,
            mastery_stats=mastery_stats
        )

    def _build_system_prompt(
        self,
        subj_info: Dict[str, Any],
        strat_info: Dict[str, Any],
        topic_name: str,
        mastery_stats: Dict[str, float],
        active_misconceptions: List[str]
    ) -> str:
        misconceptions_txt = ", ".join(active_misconceptions) if active_misconceptions else "None detected yet."
        return f"""You are the world's most advanced Adaptive AI Tutor.
YOUR SUPREME PRINCIPLE:
The goal is NEVER simply to give students answers. The goal is to make students UNDERSTAND, THINK, PRACTICE, APPLY, and INDEPENDENTLY PERFORM.

SUBJECT INTELLIGENCE ({subj_info['name']}):
{subj_info['system_directives']}

CURRENT TOPIC: {topic_name}
STUDENT COGNITIVE STATE:
- Recognition: {mastery_stats.get('recognition_score', 0)}%
- Conceptual Understanding: {mastery_stats.get('understanding_score', 0)}%
- Independent Application: {mastery_stats.get('application_score', 0)}%
- True Mastery: {mastery_stats.get('mastery_score', 0)}%
- Known Misconceptions to watch for: {misconceptions_txt}

MANDATORY ACTIVE PEDAGOGICAL STRATEGY: {strat_info['name']} ({strat_info['badge']})
STRATEGY RULE: {strat_info['rule']}
STRATEGY DIRECTIVES: {strat_info['prompt_instructions']}

CRITICAL PEDAGOGICAL BEHAVIORS:
1. If the student asks for an answer, DO NOT give the final solution. Socratic nudge or scaffold instead.
2. If the student makes an error, dissect the root misconception with a clear counter-example.
3. If the student already understands, avoid repetitive lectures; challenge them with an application or mastery check.
4. Format mathematical formulas in clear LaTeX ($...$ or $$...$$).
5. Format code cleanly in markdown with language headers.
6. Keep explanations concise, impactful, and conversational."""

    def _generate_pedagogical_fallback(
        self,
        subject_slug: str,
        topic_name: str,
        strat_info: Dict[str, Any],
        student_input: str,
        mastery_stats: Dict[str, float]
    ) -> Dict[str, Any]:
        """
        Generates rich, pedagogical responses tailored to the specific subject, topic, and strategy.
        """
        s_name = strat_info["name"]
        text_lower = student_input.lower()

        # Subject-specific tailored responses
        if subject_slug == "physics":
            if "velocity" in text_lower or "speed" in text_lower or "distance" in text_lower:
                if s_name == "Error-Based Teaching":
                    content = (
                        "### 🔍 Diagnosing the Misconception: Vector vs Scalar\n\n"
                        "Let's look closely at your statement. You wrote that **velocity = distance / time**.\n\n"
                        "Notice why that is a critical trap:\n"
                        "- **Distance** is a scalar (how much ground you covered in total).\n"
                        "- **Displacement** is a vector (the straight-line change in position from start to end, with direction).\n\n"
                        "> **Counter-Example:** Suppose an Olympic athlete runs one complete 400m lap on an oval track in 50 seconds.\n"
                        "> - Total distance = $400\\text{ m}$\n"
                        "> - Average speed = $\\frac{400}{50} = 8\\text{ m/s}$\n"
                        "> - Displacement = $0\\text{ m}$ (they ended right where they started!)\n"
                        "> - **Average velocity = $0\\text{ m/s}$**\n\n"
                        "**Now, you try:** If a car drives 30 km East, turns around, and drives 30 km West in 1 hour, what is its average speed vs average velocity?"
                    )
                elif s_name == "Socratic Teaching":
                    content = (
                        "### 🧭 Socratic Inquiry\n\n"
                        "Before we plug in numbers, let's examine the quantities involved.\n\n"
                        "When an object changes its motion, what is the exact difference between *where it travelled along the path* versus *the straight-line arrow from its starting point to its final point*?\n\n"
                        "Which of those two belongs in the definition of **velocity**?"
                    )
                elif s_name == "First-Principles Teaching":
                    content = (
                        "### ⚛️ First-Principles: Velocity from Spacetime Vectors\n\n"
                        "Let's not accept the formula as dogma. In 3-dimensional space, an object's position is given by a position vector $\\vec{r}(t)$.\n\n"
                        "When time progresses from $t_1$ to $t_2$, the change in position is:\n"
                        "$$\\Delta \\vec{r} = \\vec{r}(t_2) - \\vec{r}(t_1)$$\n\n"
                        "Notice this is pure vector subtraction. The instantaneous velocity is the derivative of position with respect to time:\n"
                        "$$\\vec{v}(t) = \\lim_{\\Delta t \\to 0} \\frac{\\Delta \\vec{r}}{\\Delta t} = \\frac{d\\vec{r}}{dt}$$\n\n"
                        "Because $\\vec{r}$ carries direction, $\\vec{v}$ must carry direction! What happens to $\\vec{v}$ if the magnitude of position stays constant, but its direction constantly rotates (like uniform circular motion)?"
                    )
                else:
                    content = (
                        f"### 💡 {strat_info['name']} — {topic_name}\n\n"
                        f"To truly master **{topic_name}**, we must connect physical intuition with mathematical rigor.\n\n"
                        "In kinematics, every vector quantity has both a magnitude and a designated direction. "
                        "When you analyze motion, the very first step is always declaring your **coordinate frame** ($+x$ vs $-x$).\n\n"
                        "What is the motion problem you are tackling right now? State the known values and what we are solving for."
                    )
            else:
                content = (
                    f"### 🔭 Physics Pedagogical Focus ({strat_info['name']})\n\n"
                    f"In **{topic_name}**, we govern systems by conservation laws and vector mechanics.\n\n"
                    "Let's step through this methodically. What forces or energy transformations are present in this scenario? "
                    "Identify whether mechanical energy is conserved or if non-conservative work (like friction) is acting."
                )

        elif subject_slug == "mathematics":
            if "integration" in text_lower or "calculus" in text_lower or "integral" in text_lower:
                if s_name == "Visual/Conceptual Teaching":
                    content = (
                        "### 📐 Visual & Geometric Intuition: Accumulation\n\n"
                        "Think of integration not as a memorized formula, but as **continuous accumulation**.\n\n"
                        "Imagine slicing the region under a curve into millions of microscopic vertical rectangles of width $dx$ and height $f(x)$:\n\n"
                        "```\n"
                        "y ^        f(x)\n"
                        "  |       .----.\n"
                        "  |      / |  | \\\n"
                        "  |     /  |  |  \\\n"
                        "  |----+---+--+---+----> x\n"
                        "       a   |dx|   b\n"
                        "```\n\n"
                        "The area of one tiny sliver is:\n"
                        "$$dA = f(x) \\cdot dx$$\n\n"
                        "The integral symbol $\\int$ is simply an elongated 'S' for *Sum*:\n"
                        "$$\\text{Total Area} = \\lim_{dx \\to 0} \\sum f(x)dx = \\int_{a}^{b} f(x)\\,dx$$\n\n"
                        "**Quick intuition check:** What would happen to the accumulated area if $f(x)$ dips below the x-axis?"
                    )
                elif s_name == "First-Principles Teaching":
                    content = (
                        "### 🏛️ First Principles: The Fundamental Theorem of Calculus\n\n"
                        "Why is integration the reverse of differentiation? Let's prove it logically.\n\n"
                        "Define an accumulation function $A(x) = \\int_{a}^{x} f(t)\\,dt$. If we increase $x$ by a tiny sliver $h$, the change in area is:\n"
                        "$$A(x+h) - A(x) \\approx f(x) \\cdot h$$\n\n"
                        "Dividing by $h$ and taking the limit as $h \\to 0$:\n"
                        "$$\\lim_{h \\to 0} \\frac{A(x+h) - A(x)}{h} = f(x) \\implies A'(x) = f(x)$$\n\n"
                        "The rate at which area accumulates is literally the height of the curve! That is why finding anti-derivatives calculates area.\n\n"
                        "How would you express the anti-derivative of $f(x) = 3x^2$ using this principle?"
                    )
                elif s_name == "Worked Example Teaching":
                    content = (
                        "### ✍️ Worked Example Demonstration: Definite Integration\n\n"
                        "Let's solve: $\\int_{1}^{3} (2x + 1)\\,dx$\n\n"
                        "**Step 1: Expert Recognition**\n"
                        "We have a polynomial sum. We apply the power rule $\\int x^n dx = \\frac{x^{n+1}}{n+1}$.\n\n"
                        "**Step 2: Anti-derivative**\n"
                        "$$F(x) = 2\\left(\\frac{x^2}{2}\\right) + x = x^2 + x$$\n\n"
                        "**Step 3: Evaluate at bounds $[1, 3]$**\n"
                        "$$F(3) = (3)^2 + 3 = 9 + 3 = 12$$\n"
                        "$$F(1) = (1)^2 + 1 = 1 + 1 = 2$$\n"
                        "$$\\text{Result} = F(3) - F(1) = 12 - 2 = 10$$\n\n"
                        "**Your turn to apply:** Solve $\\int_{0}^{2} (3x^2 - 2)\\,dx$ step by step."
                    )
                elif s_name == "Socratic Teaching":
                    content = (
                        "### ❓ Socratic Prompt\n\n"
                        "Before memorizing formulas, let's test the inverse relationship.\n\n"
                        "If differentiation takes you from **Position $\\to$ Velocity**, what physical meaning does integrating the Velocity function give you back over time?"
                    )
                else:
                    content = (
                        f"### 🧮 Mathematics Engine ({strat_info['name']})\n\n"
                        f"In **{topic_name}**, precision in algebraic manipulation and conceptual foundation are paramount.\n\n"
                        "Let's break down your specific question. Are we working with indefinite integrals, definite bounds, or an applied substitution problem?"
                    )
            else:
                content = (
                    f"### 📐 Mathematical Derivation & Practice ({strat_info['name']})\n\n"
                    f"Focusing on **{topic_name}**.\n\n"
                    "To build lasting mastery, we avoid rote memorization. Let's isolate the core formula or expression you are analyzing. "
                    "What are the given terms, and what is your current hypothesis on the next algebraic step?"
                )

        elif subject_slug == "programming":
            if s_name == "Implementation / Lab Teaching":
                content = (
                    "### 💻 Lab Execution & Debugging Studio\n\n"
                    "Let's test this in code rather than just discussing theory.\n\n"
                    "Consider this Python function with a subtle boundary bug:\n\n"
                    "```python\n"
                    "def find_first_negative(numbers):\n"
                    "    for i in range(len(numbers)):\n"
                    "        if numbers[i] < 0:\n"
                    "            return numbers[i]\n"
                    "    # What happens when there are no negative numbers?\n"
                    "```\n\n"
                    "What does this function return if `numbers = [1, 2, 3]`? How should we handle empty or non-matching lists cleanly?"
                )
            elif s_name == "Socratic Teaching":
                content = (
                    "### 🔍 Algorithmic Socratic Check\n\n"
                    "Before writing any code, let's trace the state.\n\n"
                    "If you have an array of size $N$ and you compare every element with every other element using nested loops, "
                    "how many operations will execute as $N$ grows to 10,000? Is there a data structure that can eliminate the inner loop?"
                )
            else:
                content = (
                    f"### ⚡ Computer Science Mentor ({strat_info['name']})\n\n"
                    f"Working on **{topic_name}**.\n\n"
                    "Let's look at the logic, the edge cases, and computational efficiency. "
                    "Paste your current code or pseudocode, and let's trace through its execution step-by-step."
                )

        else:
            content = (
                f"### 🎓 {strat_info['name']} — {topic_name}\n\n"
                f"**Pedagogical Objective:** {strat_info['description']}\n\n"
                f"{strat_info['prompt_instructions']}\n\n"
                f"Let's apply this directly to **{topic_name}**. What is your current understanding or the specific problem you want to explore?"
            )

        return {
            "content": content,
            "strategy_used": strat_info["name"],
            "strategy_badge": strat_info["badge"],
            "strategy_reason": f"Active Mode: {strat_info['name']} — {strat_info['description']}"
        }


pedagogical_engine = PedagogicalEngine()
