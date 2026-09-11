from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.models.database import get_db
from app.models.entities import User, Subject, Topic, TopicPrerequisite, StudentMastery, StudentMisconception
from app.routers.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/mastery")
def get_student_mastery(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    masteries = db.query(StudentMastery).filter(StudentMastery.user_id == current_user.id).all()
    
    topics_data = []
    total_rec = 0
    total_und = 0
    total_app = 0
    total_mas = 0
    
    for m in masteries:
        topic = db.query(Topic).filter(Topic.id == m.topic_id).first()
        subject = db.query(Subject).filter(Subject.id == topic.subject_id).first() if topic else None
        if topic and subject:
            topics_data.append({
                "topic_id": topic.id,
                "topic_name": topic.name,
                "subject_name": subject.name,
                "recognition": m.recognition_score,
                "understanding": m.understanding_score,
                "application": m.application_score,
                "mastery": m.mastery_score,
                "overall": m.overall_score,
                "updated_at": m.updated_at.isoformat()
            })
            total_rec += m.recognition_score
            total_und += m.understanding_score
            total_app += m.application_score
            total_mas += m.mastery_score

    count = len(topics_data) or 1
    cognitive_depth = {
        "recognition": round(total_rec / count, 1),
        "understanding": round(total_und / count, 1),
        "application": round(total_app / count, 1),
        "mastery": round(total_mas / count, 1)
    }

    return {
        "topics": topics_data,
        "cognitive_depth": cognitive_depth,
        "total_topics_tracked": len(topics_data)
    }

@router.get("/misconceptions")
def get_student_misconceptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    misc = (
        db.query(StudentMisconception)
        .filter(StudentMisconception.user_id == current_user.id)
        .order_by(StudentMisconception.updated_at.desc())
        .all()
    )
    res = []
    for m in misc:
        topic = db.query(Topic).filter(Topic.id == m.topic_id).first()
        res.append({
            "id": m.id,
            "topic_name": topic.name if topic else "General",
            "title": m.title,
            "description": m.description,
            "trigger_mistake": m.trigger_mistake,
            "counter_strategy": m.counter_strategy,
            "status": m.status,
            "occurrences": m.occurrences,
            "updated_at": m.updated_at.isoformat()
        })
    return res

@router.get("/learning-path")
def get_learning_path(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    subjects = db.query(Subject).all()
    path_data = []

    for s in subjects:
        subj_topics = []
        for t in s.topics:
            m = db.query(StudentMastery).filter(
                StudentMastery.user_id == current_user.id,
                StudentMastery.topic_id == t.id
            ).first()
            overall = m.overall_score if m else 0.0
            
            # Determine status
            if overall >= 85.0:
                status = "Mastered"
            elif overall >= 40.0:
                status = "In Progress"
            elif overall > 0.0:
                status = "Introduced"
            else:
                status = "Not Started"

            # Check prerequisites
            prereqs = (
                db.query(Topic)
                .join(TopicPrerequisite, TopicPrerequisite.prerequisite_topic_id == Topic.id)
                .filter(TopicPrerequisite.topic_id == t.id)
                .all()
            )

            subj_topics.append({
                "topic_id": t.id,
                "name": t.name,
                "order": t.order_index,
                "difficulty": t.difficulty_level,
                "mastery_score": overall,
                "status": status,
                "prerequisites": [{"id": p.id, "name": p.name} for p in prereqs]
            })
        
        path_data.append({
            "subject_id": s.id,
            "subject_name": s.name,
            "slug": s.slug,
            "color": s.color,
            "topics": sorted(subj_topics, key=lambda x: x["order"])
        })

    return path_data
