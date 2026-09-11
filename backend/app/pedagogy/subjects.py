"""
Subject-Aware Intelligence Layer for the Adaptive AI Tutor.
Tailors the cognitive requirements, verification style, and specialized tooling for each domain.
"""

from typing import Dict, Any

SUBJECT_INTELLIGENCE: Dict[str, Dict[str, Any]] = {
    "mathematics": {
        "name": "Mathematics",
        "focus": "Conceptual foundations, formulas, rigorous derivations, progressive problem solving, error analysis",
        "system_directives": (
            "You are an expert Mathematics tutor with deep pedagogical precision. "
            "Always maintain rigorous mathematical reasoning. Render mathematical formulas in clear LaTeX format ($...$ or $$...$$). "
            "Never skip intermediate algebraic steps unless the student has demonstrated master-level fluency. "
            "Check for common algebraic sign slips, domain restrictions (e.g. division by zero, logarithms of negatives), "
            "and verify prerequisites like factoring or trigonometric identities when solving calculus."
        ),
        "typical_misconceptions": [
            "Cancelling terms across additions in fractions (e.g. (x+2)/2 = x+1)",
            "Distributing exponents over sums ((a+b)^2 = a^2 + b^2)",
            "Sign flips during inequality division by negatives",
            "Confusing derivative with anti-derivative or forgetting +C in indefinite integrals"
        ]
    },
    "physics": {
        "name": "Physics",
        "focus": "Physical intuition, coordinate systems, fundamental laws, numerical applications, unit analysis",
        "system_directives": (
            "You are an expert Physics tutor. Anchor every mathematical derivation in concrete physical intuition. "
            "Strictly enforce unit tracking at every step. "
            "Distinguish clearly between scalar and vector quantities (e.g., speed vs velocity, distance vs displacement). "
            "Encourage free-body diagrams, reference frame selection, and conservation principles (energy, momentum, charge)."
        ),
        "typical_misconceptions": [
            "Confusing scalar distance with vector displacement (e.g. velocity = distance / time)",
            "Believing an object requires constant force to stay in motion (Aristotelian trap vs Newton's 1st law)",
            "Confusing action-reaction pairs with opposing forces on the same object (Newton's 3rd law)",
            "Treating acceleration as zero at the peak of vertical projectile motion"
        ]
    },
    "chemistry": {
        "name": "Chemistry",
        "focus": "Molecular mechanisms, balanced equations, stoichiometry, periodic trends, equilibrium",
        "system_directives": (
            "You are an expert Chemistry tutor. Connect macroscopic observations (color change, precipitate, heat) "
            "to sub-microscopic particle interactions (electrons, orbital overlap, intermolecular forces). "
            "Strictly enforce mass and charge conservation in reaction equations. "
            "Use mole concepts systematically and track state symbols ((s), (l), (g), (aq))."
        ),
        "typical_misconceptions": [
            "Confusing bond breaking with energy release (breaking bonds ALWAYS requires energy input)",
            "Subscript vs coefficient confusion when balancing chemical equations",
            "Believing dynamic equilibrium means reaction has stopped or concentrations are equal",
            "Confusing strong vs concentrated acids"
        ]
    },
    "biology": {
        "name": "Biology",
        "focus": "Cellular processes, physiological structures, genetic mechanisms, evolutionary context",
        "system_directives": (
            "You are an expert Biology tutor. Structure explanations around form-fits-function principles. "
            "Connect molecular biology (DNA, RNA, proteins) with macro-scale organ systems and ecosystems. "
            "Use clear step-by-step cascades for complex biological pathways (e.g., cellular respiration, synaptic transmission). "
            "Emphasize precise biological terminology while ensuring the student understands the underlying mechanism."
        ),
        "typical_misconceptions": [
            "Believing mutations occur 'in order to' adapt (teleological misconception vs random mutation + natural selection)",
            "Confusing respiration with breathing (cellular ATP generation vs gas exchange)",
            "Confusing dominant alleles with 'most common' or 'better' alleles in a population",
            "Assuming plants only do photosynthesis and not cellular respiration"
        ]
    },
    "programming": {
        "name": "Computer Science & Programming",
        "focus": "Algorithmic logic, computational complexity, code tracing, state inspection, debugging, edge cases",
        "system_directives": (
            "You are an expert Computer Science mentor. Teach students how to read, trace, and debug code mentally. "
            "When students ask why their code fails, guide them to isolate the faulty line using print statements or edge cases. "
            "Provide clean, idiomatic code examples with test assertions. "
            "Emphasize time and space complexity (Big-O) and boundary conditions (empty arrays, off-by-one errors, null pointers)."
        ),
        "typical_misconceptions": [
            "Off-by-one errors in loop bounds and 0-indexed arrays",
            "Confusing assignment (=) with equality comparison (==)",
            "Variable scope confusion (local variables shadowing globals or mutation in function calls)",
            "Assuming recursion terminates automatically without a correct base case"
        ]
    },
    "english": {
        "name": "English & Languages",
        "focus": "Textual analysis, grammatical precision, rhetorical devices, argumentation, synthesis",
        "system_directives": (
            "You are an expert Language & Humanities tutor. Focus on critical textual analysis, argumentative coherence, "
            "and stylistic sophistication. Guide the student to substantiate claims with specific textual evidence. "
            "Provide targeted feedback on grammar, syntax, tone, and rhetorical effectiveness."
        ),
        "typical_misconceptions": [
            "Confusing plot summary with literary analysis",
            "Comma splices and run-on sentences",
            "Passive voice overuse leading to unclear agency",
            "Conflating correlation with causal argumentation in essays"
        ]
    }
}
