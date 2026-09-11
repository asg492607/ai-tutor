from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.models.database import get_db
from app.models.entities import User, Subject, Topic, TutorSession, SessionMessage, StudentMastery, StudentMisconception
from app.routers.auth import get_current_user
from app.pedagogy.engine import pedagogical_engine
from app.pedagogy.strategies import TEACHING_STRATEGIES

router = APIRouter(prefix="/tutor", tags=["Tutor"])

class CreateSessionRequest(BaseModel):
    subject_id: int
    topic_id: int
    mode: Optional[str] = "Learn"  # Learn, Practice, Revise, Apply, Build, Prepare, Diagnose
    initial_strategy: Optional[str] = "Socratic Teaching"
    initial_difficulty: Optional[str] = "Intermediate"

class MessageRequest(BaseModel):
    content: str

class ChangeStrategyRequest(BaseModel):
    strategy_name: str

@router.post("/sessions")
def create_session(
    req: CreateSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    subject = db.query(Subject).filter(Subject.id == req.subject_id).first()
    topic = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if not subject or not topic:
        raise HTTPException(status_code=404, detail="Subject or Topic not found")
    
    # Ensure strategy is valid
    strat = req.initial_strategy if req.initial_strategy in TEACHING_STRATEGIES else "Socratic Teaching"

    session = TutorSession(
        user_id=current_user.id,
        subject_id=req.subject_id,
        topic_id=req.topic_id,
        current_strategy=strat,
        current_difficulty=req.initial_difficulty,
        mode=req.mode,
        status="active"
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Ensure student mastery row exists
    mastery = db.query(StudentMastery).filter(
        StudentMastery.user_id == current_user.id,
        StudentMastery.topic_id == topic.id
    ).first()
    if not mastery:
        mastery = StudentMastery(
            user_id=current_user.id,
            topic_id=topic.id,
            recognition_score=15.0,
            understanding_score=10.0,
            application_score=0.0,
            mastery_score=0.0,
            overall_score=8.0
        )
        db.add(mastery)
        db.commit()

    # Initial Welcome message from Tutor tailored to the topic and mode
    welcome_text = (
        f"👋 Hello **{current_user.name}**! I'm your AI Tutor for **{topic.name}** ({subject.name}).\n\n"
        f"**Our Goal:** Build deep conceptual understanding and independent mastery — not just memorize answers.\n"
        f"**Active Mode:** `{session.mode}` | **Teaching Approach:** `{session.current_strategy}`\n\n"
        f"To get started, tell me what you currently understand about **{topic.name}**, or ask a question you'd like to explore!"
    )
    welcome_msg = SessionMessage(
        session_id=session.id,
        sender="tutor",
        content=welcome_text,
        strategy_used=session.current_strategy,
        cognitive_level="Recognition"
    )
    db.add(welcome_msg)
    db.commit()

    return {
        "session_id": session.id,
        "subject": {"id": subject.id, "name": subject.name, "slug": subject.slug},
        "topic": {"id": topic.id, "name": topic.name, "slug": topic.slug},
        "current_strategy": session.current_strategy,
        "current_difficulty": session.current_difficulty,
        "mode": session.mode,
        "created_at": session.created_at.isoformat()
    }

@router.get("/sessions")
def get_user_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = (
        db.query(TutorSession)
        .filter(TutorSession.user_id == current_user.id)
        .order_by(TutorSession.updated_at.desc())
        .limit(20)
        .all()
    )
    res = []
    for s in sessions:
        last_msg = db.query(SessionMessage).filter(SessionMessage.session_id == s.id).order_by(SessionMessage.timestamp.desc()).first()
        topic = db.query(Topic).filter(Topic.id == s.topic_id).first()
        subject = db.query(Subject).filter(Subject.id == s.subject_id).first()
        res.append({
            "id": s.id,
            "subject_name": subject.name if subject else "General",
            "topic_name": topic.name if topic else "Topic",
            "current_strategy": s.current_strategy,
            "mode": s.mode,
            "updated_at": s.updated_at.isoformat(),
            "last_message": last_msg.content[:100] + "..." if last_msg else ""
        })
    return res

@router.get("/sessions/{session_id}")
def get_session_detail(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(TutorSession).filter(TutorSession.id == session_id, TutorSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    topic = db.query(Topic).filter(Topic.id == session.topic_id).first()
    subject = db.query(Subject).filter(Subject.id == session.subject_id).first()
    mastery = db.query(StudentMastery).filter(StudentMastery.user_id == current_user.id, StudentMastery.topic_id == session.topic_id).first()
    misconceptions = db.query(StudentMisconception).filter(StudentMisconception.user_id == current_user.id, StudentMisconception.topic_id == session.topic_id).all()

    messages = db.query(SessionMessage).filter(SessionMessage.session_id == session.id).order_by(SessionMessage.timestamp.asc()).all()

    return {
        "id": session.id,
        "subject": {"id": subject.id, "name": subject.name, "slug": subject.slug},
        "topic": {"id": topic.id, "name": topic.name, "slug": topic.slug, "difficulty": topic.difficulty_level},
        "current_strategy": session.current_strategy,
        "current_difficulty": session.current_difficulty,
        "mode": session.mode,
        "mastery": {
            "recognition": mastery.recognition_score if mastery else 0,
            "understanding": mastery.understanding_score if mastery else 0,
            "application": mastery.application_score if mastery else 0,
            "mastery": mastery.mastery_score if mastery else 0,
            "overall": mastery.overall_score if mastery else 0
        },
        "misconceptions": [{"title": m.title, "status": m.status, "occurrences": m.occurrences} for m in misconceptions],
        "messages": [
            {
                "id": m.id,
                "sender": m.sender,
                "content": m.content,
                "strategy_used": m.strategy_used,
                "cognitive_level": m.cognitive_level,
                "misconception_detected": m.misconception_detected,
                "timestamp": m.timestamp.isoformat()
            }
            for m in messages
        ]
    }

@router.post("/sessions/{session_id}/message")
def send_message(
    session_id: int,
    req: MessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(TutorSession).filter(TutorSession.id == session_id, TutorSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    topic = db.query(Topic).filter(Topic.id == session.topic_id).first()
    subject = db.query(Subject).filter(Subject.id == session.subject_id).first()

    # 1. Save student message
    student_msg = SessionMessage(
        session_id=session.id,
        sender="student",
        content=req.content,
        timestamp=datetime.utcnow()
    )
    db.add(student_msg)
    db.commit()

    # 2. Fetch current mastery
    mastery = db.query(StudentMastery).filter(
        StudentMastery.user_id == current_user.id,
        StudentMastery.topic_id == topic.id
    ).first()
    if not mastery:
        mastery = StudentMastery(
            user_id=current_user.id,
            topic_id=topic.id,
            recognition_score=15.0,
            understanding_score=10.0,
            application_score=0.0,
            mastery_score=0.0,
            overall_score=8.0
        )
        db.add(mastery)
        db.commit()

    current_scores = {
        "recognition_score": mastery.recognition_score,
        "understanding_score": mastery.understanding_score,
        "application_score": mastery.application_score,
        "mastery_score": mastery.mastery_score,
        "overall_score": mastery.overall_score
    }

    # 3. Evaluate cognitive progress & misconceptions
    updated_scores, detected_misc, cognitive_level, next_strategy = pedagogical_engine.evaluate_cognitive_progress(
        student_input=req.content,
        current_strategy=session.current_strategy,
        current_mastery=current_scores,
        topic_name=topic.name,
        subject_slug=subject.slug
    )

    # Update database mastery
    mastery.recognition_score = updated_scores["recognition_score"]
    mastery.understanding_score = updated_scores["understanding_score"]
    mastery.application_score = updated_scores["application_score"]
    mastery.mastery_score = updated_scores["mastery_score"]
    mastery.overall_score = updated_scores["overall_score"]
    mastery.updated_at = datetime.utcnow()

    # Handle detected misconception in memory
    misc_title = None
    if detected_misc:
        misc_title = detected_misc["title"]
        existing_misc = db.query(StudentMisconception).filter(
            StudentMisconception.user_id == current_user.id,
            StudentMisconception.topic_id == topic.id,
            StudentMisconception.title == detected_misc["title"]
        ).first()
        if existing_misc:
            existing_misc.occurrences += 1
            existing_misc.status = "Active"
            existing_misc.updated_at = datetime.utcnow()
        else:
            new_misc = StudentMisconception(
                user_id=current_user.id,
                topic_id=topic.id,
                title=detected_misc["title"],
                description=detected_misc["description"],
                counter_strategy=detected_misc["counter_strategy"],
                trigger_mistake=req.content,
                status="Active",
                occurrences=1
            )
            db.add(new_misc)

    # Strategy transition
    if next_strategy != session.current_strategy:
        session.current_strategy = next_strategy
    session.updated_at = datetime.utcnow()
    db.commit()

    # 4. Fetch recent history for LLM
    past_messages = (
        db.query(SessionMessage)
        .filter(SessionMessage.session_id == session.id)
        .order_by(SessionMessage.timestamp.desc())
        .limit(8)
        .all()
    )
    past_messages.reverse()
    history = [{"sender": m.sender, "content": m.content} for m in past_messages]

    active_misc_list = [
        m.title for m in db.query(StudentMisconception).filter(
            StudentMisconception.user_id == current_user.id,
            StudentMisconception.status == "Active"
        ).all()
    ]

    # 5. Generate Tutor response
    response_data = pedagogical_engine.generate_response(
        subject_slug=subject.slug,
        topic_name=topic.name,
        current_strategy=session.current_strategy,
        student_input=req.content,
        history=history,
        mastery_stats=updated_scores,
        active_misconceptions=active_misc_list
    )

    # Save tutor message
    tutor_msg = SessionMessage(
        session_id=session.id,
        sender="tutor",
        content=response_data["content"],
        strategy_used=response_data["strategy_used"],
        cognitive_level=cognitive_level,
        misconception_detected=misc_title,
        timestamp=datetime.utcnow()
    )
    db.add(tutor_msg)
    db.commit()
    db.refresh(tutor_msg)

    return {
        "message": {
            "id": tutor_msg.id,
            "sender": "tutor",
            "content": tutor_msg.content,
            "strategy_used": tutor_msg.strategy_used,
            "cognitive_level": tutor_msg.cognitive_level,
            "misconception_detected": misc_title,
            "timestamp": tutor_msg.timestamp.isoformat()
        },
        "current_strategy": session.current_strategy,
        "strategy_badge": response_data.get("strategy_badge", "Adaptive"),
        "strategy_reason": response_data.get("strategy_reason", ""),
        "updated_mastery": updated_scores,
        "misconception": detected_misc
    }

@router.post("/sessions/{session_id}/hint")
def request_hint(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(TutorSession).filter(TutorSession.id == session_id, TutorSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    topic = db.query(Topic).filter(Topic.id == session.topic_id).first()

    hint_text = (
        f"💡 **Socratic Hint for {topic.name}:**\n\n"
        "Ask yourself: What is the fundamental relation connecting your given parameters?\n"
        "If you write down the units of your known quantities, what units must the answer have?\n"
        "Try isolating the primary variable on one side before substituting numbers."
    )

    tutor_msg = SessionMessage(
        session_id=session.id,
        sender="tutor",
        content=hint_text,
        strategy_used="Guided Discovery",
        cognitive_level="Understanding",
        timestamp=datetime.utcnow()
    )
    db.add(tutor_msg)
    db.commit()
    db.refresh(tutor_msg)

    return {
        "message": {
            "id": tutor_msg.id,
            "sender": "tutor",
            "content": tutor_msg.content,
            "strategy_used": "Guided Discovery",
            "cognitive_level": "Understanding",
            "timestamp": tutor_msg.timestamp.isoformat()
        }
    }

@router.post("/sessions/{session_id}/change-strategy")
def change_strategy(
    session_id: int,
    req: ChangeStrategyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(TutorSession).filter(TutorSession.id == session_id, TutorSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if req.strategy_name not in TEACHING_STRATEGIES:
        raise HTTPException(status_code=400, detail="Invalid teaching strategy")
    
    session.current_strategy = req.strategy_name
    db.commit()

    strat_info = TEACHING_STRATEGIES[req.strategy_name]
    notify_text = (
        f"🔄 **Teaching Methodology Switched to: {strat_info['name']}** ({strat_info['badge']})\n\n"
        f"*{strat_info['description']}*\n\n"
        f"Rule: {strat_info['rule']}"
    )

    tutor_msg = SessionMessage(
        session_id=session.id,
        sender="system",
        content=notify_text,
        strategy_used=strat_info['name'],
        timestamp=datetime.utcnow()
    )
    db.add(tutor_msg)
    db.commit()

    return {
        "current_strategy": session.current_strategy,
        "strategy_info": strat_info
    }
