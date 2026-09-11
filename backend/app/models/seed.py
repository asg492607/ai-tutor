from sqlalchemy.orm import Session
from app.models.entities import Subject, Topic, TopicPrerequisite

def seed_curriculum(db: Session):
    # Check if subjects already exist
    if db.query(Subject).first():
        return

    curriculum_data = [
        {
            "name": "Mathematics",
            "slug": "mathematics",
            "description": "Foundational algebra, derivations, geometry, calculus, and mathematical modeling.",
            "icon": "Sigma",
            "color": "#38bdf8",
            "topics": [
                {"name": "Linear Equations & Expressions", "slug": "linear-equations", "order": 1, "diff": "Introductory", "prereqs": []},
                {"name": "Quadratic Equations & Factoring", "slug": "quadratic-equations", "order": 2, "diff": "Intermediate", "prereqs": [1]},
                {"name": "Functions & Analytic Geometry", "slug": "functions-geometry", "order": 3, "diff": "Intermediate", "prereqs": [1]},
                {"name": "Differential Calculus", "slug": "differential-calculus", "order": 4, "diff": "Advanced", "prereqs": [3]},
                {"name": "Integral Calculus", "slug": "integral-calculus", "order": 5, "diff": "Advanced", "prereqs": [4]}
            ]
        },
        {
            "name": "Physics",
            "slug": "physics",
            "description": "Mechanics, vector kinematics, conservation laws, electromagnetism, and physical intuition.",
            "icon": "Atom",
            "color": "#818cf8",
            "topics": [
                {"name": "1D Kinematics: Distance vs Displacement", "slug": "1d-kinematics", "order": 1, "diff": "Introductory", "prereqs": []},
                {"name": "Vectors & 2D Projectile Motion", "slug": "vectors-projectiles", "order": 2, "diff": "Intermediate", "prereqs": [1]},
                {"name": "Newton's Laws of Motion & Free Body Diagrams", "slug": "newtons-laws", "order": 3, "diff": "Intermediate", "prereqs": [2]},
                {"name": "Work, Energy & Conservation Principles", "slug": "work-energy", "order": 4, "diff": "Intermediate", "prereqs": [3]},
                {"name": "Electrostatics & Electric Fields", "slug": "electrostatics", "order": 5, "diff": "Advanced", "prereqs": [3]}
            ]
        },
        {
            "name": "Chemistry",
            "slug": "chemistry",
            "description": "Atomic structures, chemical bonding, stoichiometry, and reaction equilibrium.",
            "icon": "FlaskConical",
            "color": "#34d399",
            "topics": [
                {"name": "Atomic Structure & Periodic Trends", "slug": "atomic-structure", "order": 1, "diff": "Introductory", "prereqs": []},
                {"name": "Chemical Bonding & Molecular Shapes", "slug": "chemical-bonding", "order": 2, "diff": "Intermediate", "prereqs": [1]},
                {"name": "Stoichiometry & Mole Calculations", "slug": "stoichiometry", "order": 3, "diff": "Intermediate", "prereqs": [2]},
                {"name": "Chemical Equilibrium & Le Chatelier", "slug": "chemical-equilibrium", "order": 4, "diff": "Advanced", "prereqs": [3]}
            ]
        },
        {
            "name": "Biology",
            "slug": "biology",
            "description": "Cellular biology, genetics, evolutionary theory, and physiological systems.",
            "icon": "Dna",
            "color": "#f472b6",
            "topics": [
                {"name": "Cell Structure & Membrane Transport", "slug": "cell-structure", "order": 1, "diff": "Introductory", "prereqs": []},
                {"name": "Cellular Respiration & Energy Conversion", "slug": "cellular-respiration", "order": 2, "diff": "Intermediate", "prereqs": [1]},
                {"name": "DNA Replication & Protein Synthesis", "slug": "dna-replication", "order": 3, "diff": "Intermediate", "prereqs": [1]},
                {"name": "Evolution & Natural Selection", "slug": "natural-selection", "order": 4, "diff": "Advanced", "prereqs": [3]}
            ]
        },
        {
            "name": "Computer Science",
            "slug": "programming",
            "description": "Programming syntax, algorithms, data structures, debugging, and computational thinking.",
            "icon": "Code2",
            "color": "#fb923c",
            "topics": [
                {"name": "Variables, Types & Conditional Logic", "slug": "variables-control-flow", "order": 1, "diff": "Introductory", "prereqs": []},
                {"name": "Loops, Arrays & Iteration", "slug": "loops-arrays", "order": 2, "diff": "Introductory", "prereqs": [1]},
                {"name": "Functions, Scope & Modular Code", "slug": "functions-scope", "order": 3, "diff": "Intermediate", "prereqs": [2]},
                {"name": "Recursion & Divide-and-Conquer", "slug": "recursion", "order": 4, "diff": "Advanced", "prereqs": [3]},
                {"name": "Time Complexity & Big-O Optimization", "slug": "big-o-complexity", "order": 5, "diff": "Advanced", "prereqs": [3]}
            ]
        },
        {
            "name": "English & Writing",
            "slug": "english",
            "description": "Rhetoric, argumentative synthesis, grammatical mastery, and literary analysis.",
            "icon": "Feather",
            "color": "#a78bfa",
            "topics": [
                {"name": "Grammar Architecture & Sentence Syntax", "slug": "grammar-syntax", "order": 1, "diff": "Introductory", "prereqs": []},
                {"name": "Close Reading & Textual Evidence", "slug": "textual-analysis", "order": 2, "diff": "Intermediate", "prereqs": [1]},
                {"name": "Rhetorical Devices & Persuasive Synthesis", "slug": "rhetorical-synthesis", "order": 3, "diff": "Advanced", "prereqs": [2]}
            ]
        }
    ]

    for s_data in curriculum_data:
        subject = Subject(
            name=s_data["name"],
            slug=s_data["slug"],
            description=s_data["description"],
            icon=s_data["icon"],
            color=s_data["color"]
        )
        db.add(subject)
        db.commit()
        db.refresh(subject)

        created_topics = {}
        for t_data in s_data["topics"]:
            topic = Topic(
                subject_id=subject.id,
                name=t_data["name"],
                slug=t_data["slug"],
                order_index=t_data["order"],
                difficulty_level=t_data["diff"]
            )
            db.add(topic)
            db.commit()
            db.refresh(topic)
            created_topics[t_data["order"]] = topic.id

        # Wire up prerequisites
        for t_data in s_data["topics"]:
            current_topic_id = created_topics[t_data["order"]]
            for prereq_order in t_data["prereqs"]:
                prereq_topic_id = created_topics.get(prereq_order)
                if prereq_topic_id:
                    prereq_relation = TopicPrerequisite(
                        topic_id=current_topic_id,
                        prerequisite_topic_id=prereq_topic_id
                    )
                    db.add(prereq_relation)
        db.commit()
