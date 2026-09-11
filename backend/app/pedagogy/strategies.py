"""
The 17 Distinct Teaching Methodologies for the Adaptive AI Tutor.
Each strategy dictates precise pedagogical behavior, cognitive objectives, and constraint rules.
"""

from typing import Dict, Any

TEACHING_STRATEGIES: Dict[str, Dict[str, Any]] = {
    "Direct Teaching": {
        "id": "direct",
        "name": "Direct Teaching",
        "badge": "Clarity & Structure",
        "description": "Explains the concept clearly, systematically, and unambiguously.",
        "best_for": "When the student has zero prior knowledge or explicitly requests a clean explanation.",
        "rule": "Deliver concise, structured explanations. Avoid jargon without definitions. Conclude with a quick comprehension verification question.",
        "prompt_instructions": (
            "Explain the concept clearly and systematically from ground up. "
            "Structure your answer with clear sections, core definitions, and key takeaways. "
            "At the end, ask a single targeted check-for-understanding question."
        )
    },
    "Socratic Teaching": {
        "id": "socratic",
        "name": "Socratic Teaching",
        "badge": "Critical Thinking",
        "description": "Asks carefully chosen questions to guide the student to reason toward the truth themselves.",
        "best_for": "Critical thinking, conceptual debugging, and active problem solving.",
        "rule": "NEVER provide the direct final answer. Ask one provocative, focused question that prompts the student to examine their premise.",
        "prompt_instructions": (
            "DO NOT give the direct answer or full solution. "
            "Ask one incisive, encouraging question that forces the student to reason about the next step or analyze their assumptions. "
            "Keep the cognitive load on the student."
        )
    },
    "Step-by-Step Teaching": {
        "id": "step_by_step",
        "name": "Step-by-Step Teaching",
        "badge": "Procedural Logic",
        "description": "Breaks complex problems into discrete logical stages, explaining the 'why' behind each step.",
        "best_for": "Mathematics, physics derivations, algorithms, and systematic workflows.",
        "rule": "Show Step N, explain why it follows from Step N-1, and ask the student to complete or justify Step N+1.",
        "prompt_instructions": (
            "Break down the concept or problem into numbered, logical steps. "
            "For each step, explain not just WHAT is done, but WHY it is necessary. "
            "Then invite the student to attempt or identify the next logical step."
        )
    },
    "Worked Example Teaching": {
        "id": "worked_example",
        "name": "Worked Example Teaching",
        "badge": "Expert Demonstration",
        "description": "Demonstrates a complete problem from start to finish, modeling the thought process of an expert.",
        "best_for": "Seeing how professionals approach complex tasks before trying alone.",
        "rule": "Walk through an entire problem showing internal reasoning, scratchpad thinking, and verification.",
        "prompt_instructions": (
            "Demonstrate a complete, realistic worked example. "
            "Explicitly vocalize expert metacognition: 'Here is what an expert notices first... Notice this trap... Now we verify our units.' "
            "Then present a parallel problem for the student to solve."
        )
    },
    "Feynman Teaching": {
        "id": "feynman",
        "name": "Feynman Teaching",
        "badge": "Simplicity Test",
        "description": "Explains complex ideas in simple, everyday language and challenges the student to explain it back.",
        "best_for": "Exposing hidden gaps and eliminating memorization illusion.",
        "rule": "Ban obscure jargon. If a term is used, define it with child-like clarity. Prompt student to teach it back.",
        "prompt_instructions": (
            "Explain this concept as if talking to a bright 12-year-old. "
            "Use clear, plain language with zero unnecessary jargon. "
            "Then prompt the student: 'Now in your own words, how would you explain this to a friend?'"
        )
    },
    "Analogy-Based Teaching": {
        "id": "analogy",
        "name": "Analogy-Based Teaching",
        "badge": "Intuition Bridge",
        "description": "Connects abstract concepts to familiar, physical real-world phenomena.",
        "best_for": "Abstract mechanics (e.g. electrical current as water flow, pointers as house addresses).",
        "rule": "Provide a high-fidelity analogy, explain where the analogy holds, and explicitly state where the analogy breaks down.",
        "prompt_instructions": (
            "Build an intuitive bridge using a rich, relatable real-world analogy. "
            "Map the components: Concept X is like Real-World Y. "
            "Crucially, point out where the analogy is accurate and where it reaches its limit."
        )
    },
    "Visual/Conceptual Teaching": {
        "id": "visual",
        "name": "Visual/Conceptual Teaching",
        "badge": "Spatial & Graphical",
        "description": "Prioritizes geometric intuition, concept maps, coordinate relationships, and diagrammatic reasoning.",
        "best_for": "Calculus (area under curve), geometry, vectors, data structures, and molecular models.",
        "rule": "Generate ASCII/SVG diagrams, describe spatial layouts, and describe geometric transformations vividly.",
        "prompt_instructions": (
            "Use visual representations, ASCII architecture/geometry diagrams, coordinate relations, or flowcharts. "
            "Anchor the concept in spatial and visual intuition before writing algebraic formulas."
        )
    },
    "First-Principles Teaching": {
        "id": "first_principles",
        "name": "First-Principles Teaching",
        "badge": "Fundamental Axioms",
        "description": "Starts from fundamental truths and builds the concept up logically, proving why formulas exist.",
        "best_for": "Deep mastery, physics laws, mathematical proofs, and foundational science.",
        "rule": "Do not state formulas as given dogma. Derive or build them from fundamental axioms of reality or logic.",
        "prompt_instructions": (
            "Start from fundamental ground truth and basic axioms. "
            "Do not accept any formula at face value—derive why it must be true step-by-step from base assumptions."
        )
    },
    "Compare-and-Contrast Teaching": {
        "id": "compare_contrast",
        "name": "Compare-and-Contrast Teaching",
        "badge": "Nuance Discrimination",
        "description": "Juxtaposes easily confused concepts side by side to sharpen mental boundaries.",
        "best_for": "Speed vs Velocity, Compiler vs Interpreter, Mass vs Weight, Synchronous vs Asynchronous.",
        "rule": "Create a side-by-side comparison table or contrast matrix emphasizing critical differences and diagnostic tests.",
        "prompt_instructions": (
            "Compare and contrast the concept with its commonly confused counterpart. "
            "Highlight the subtle boundaries, provide a comparison breakdown, and present a litmus test to differentiate them."
        )
    },
    "Error-Based Teaching": {
        "id": "error_based",
        "name": "Error-Based Teaching",
        "badge": "Misconception Diagnosis",
        "description": "Uses student mistakes as primary learning material, dissecting the underlying misconception.",
        "best_for": "When student submits an incorrect calculation, buggy code, or flawed reasoning.",
        "rule": "Identify: 1) What was wrong, 2) Why it seemed plausible, 3) The underlying flawed mental model, 4) A counter-example.",
        "prompt_instructions": (
            "Analyze the student's exact error. Do not simply say 'incorrect'. "
            "Explain the exact misconception behind it: 'You did X because you assumed Y, but notice Z.' "
            "Provide a clear counterexample, then guide them to re-evaluate."
        )
    },
    "Guided Discovery": {
        "id": "guided_discovery",
        "name": "Guided Discovery",
        "badge": "Eureka Moments",
        "description": "Provides layered scaffolding and incremental breadcrumbs so the student discovers the truth themselves.",
        "best_for": "Fostering genuine eureka moments and self-reliance.",
        "rule": "Provide Hint Level 1 (nudge). Only advance to Level 2 (structural hint) if the student is still stuck.",
        "prompt_instructions": (
            "Give a subtle, calibrated hint or breadcrumb. "
            "Ask what happens if they inspect a specific variable, boundary condition, or pattern. "
            "Let them experience the joy of discovering the principle themselves."
        )
    },
    "Practice-First Teaching": {
        "id": "practice_first",
        "name": "Practice-First Teaching",
        "badge": "Active Problem Solving",
        "description": "Leads immediately with a concrete problem, introducing theory only as the student tries to solve it.",
        "best_for": "Students who learn by doing rather than reading passive lectures.",
        "rule": "Present a challenge question upfront. Use the student's attempt to unpack the necessary theory.",
        "prompt_instructions": (
            "Skip the lecture. Present a compelling, tailored problem immediately. "
            "Prompt the student: 'Try solving this with your current intuition. We will build the theory together from your attempt.'"
        )
    },
    "Simulation / Scenario Teaching": {
        "id": "simulation",
        "name": "Simulation / Scenario Teaching",
        "badge": "Real-World Context",
        "description": "Places the student in a realistic professional scenario where the concept must be applied under constraints.",
        "best_for": "Engineering decisions, clinical reasoning, business tradeoffs, architecture analysis.",
        "rule": "Set a role and context: 'You are an engineer at NASA / doctor in ER / backend architect.' Present decisions.",
        "prompt_instructions": (
            "Place the student in a realistic professional scenario: "
            "'You are the lead engineer on an aerospace launch system / financial analyst at a market opening.' "
            "Frame the question as a high-stakes decision requiring their conceptual knowledge."
        )
    },
    "Project-Based Teaching": {
        "id": "project_based",
        "name": "Project-Based Teaching",
        "badge": "Synthesis & Creation",
        "description": "Teaches concepts as building blocks within a cohesive multi-part artifact or application.",
        "best_for": "Programming, product design, engineering, and data science.",
        "rule": "Frame the topic as one component of an exciting project (e.g. building a physics simulation, web crawler).",
        "prompt_instructions": (
            "Contextualize this lesson within a concrete project. "
            "Explain how mastering this single piece moves the student forward in building the overall system."
        )
    },
    "Implementation / Lab Teaching": {
        "id": "lab",
        "name": "Implementation / Lab Teaching",
        "badge": "Execution & Verification",
        "description": "Focuses on hands-on execution, test cases, debugging, and concrete verification in code/experiments.",
        "best_for": "Programming languages, command line tools, laboratory protocols.",
        "rule": "Require code or concrete calculation. Check boundary cases, test cases, and runtime behavior.",
        "prompt_instructions": (
            "Provide executable code snippets or lab protocol steps. "
            "Challenge the student to predict output, debug the failing test case, or write an implementation that passes edge cases."
        )
    },
    "Revision / Recall Teaching": {
        "id": "revision",
        "name": "Revision / Recall Teaching",
        "badge": "Active Retrieval",
        "description": "Uses spaced repetition and active retrieval drills to solidify long-term memory.",
        "best_for": "Exam prep, formula retention, terminology, and combating the forgetting curve.",
        "rule": "Do not repeat explanations. Prompt the student to retrieve key facts, definitions, or derivations from memory.",
        "prompt_instructions": (
            "Use active retrieval. Ask the student to recall core principles without looking at notes. "
            "Test their memory on key formulas, nuances, and edge conditions with quick-fire retrieval prompts."
        )
    },
    "Exam / Performance Teaching": {
        "id": "exam",
        "name": "Exam / Performance Teaching",
        "badge": "Assessment Mastery",
        "description": "Trains the student under timed, high-stakes examination formats with rubric-based scoring.",
        "best_for": "AP Exams, SAT/ACT, University midterms, competitive coding, technical interviews.",
        "rule": "Provide exam-calibrated questions with mark allocations, timing guidance, and rubric scoring criteria.",
        "prompt_instructions": (
            "Present this as a formal exam question with allocated marks and time guidance (e.g., '[4 Marks] Time: 5 mins'). "
            "Evaluate their answer against a strict official grading rubric, highlighting missing keywords or steps."
        )
    }
}
