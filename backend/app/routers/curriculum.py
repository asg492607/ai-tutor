from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.models.database import get_db
from app.models.entities import Subject, Topic, TopicPrerequisite
from app.pedagogy.strategies import TEACHING_STRATEGIES

router = APIRouter(prefix="/curriculum", tags=["Curriculum"])

@router.get("/subjects")
def get_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    res = []
    for s in subjects:
        res.append({
            "id": s.id,
            "name": s.name,
            "slug": s.slug,
            "description": s.description,
            "icon": s.icon,
            "color": s.color,
            "topic_count": len(s.topics)
        })
    return res

@router.get("/subjects/{subject_id}/topics")
def get_topics_for_subject(subject_id: int, db: Session = Depends(get_db)):
    topics = db.query(Topic).filter(Topic.subject_id == subject_id).order_by(Topic.order_index).all()
    res = []
    for t in topics:
        prereqs = (
            db.query(Topic)
            .join(TopicPrerequisite, TopicPrerequisite.prerequisite_topic_id == Topic.id)
            .filter(TopicPrerequisite.topic_id == t.id)
            .all()
        )
        res.append({
            "id": t.id,
            "name": t.name,
            "slug": t.slug,
            "description": t.description,
            "order_index": t.order_index,
            "difficulty_level": t.difficulty_level,
            "prerequisites": [{"id": p.id, "name": p.name} for p in prereqs]
        })
    return res

@router.get("/strategies")
def get_strategies():
    return list(TEACHING_STRATEGIES.values())
