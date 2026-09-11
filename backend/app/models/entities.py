from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    grade_level = Column(String(100), default="High School / Undergraduate")
    created_at = Column(DateTime, default=datetime.utcnow)

    sessions = relationship("TutorSession", back_populates="user", cascade="all, delete-orphan")
    masteries = relationship("StudentMastery", back_populates="user", cascade="all, delete-orphan")
    misconceptions = relationship("StudentMisconception", back_populates="user", cascade="all, delete-orphan")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="BookOpen")
    color = Column(String(50), default="#38bdf8")

    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=1)
    difficulty_level = Column(String(50), default="Intermediate")

    subject = relationship("Subject", back_populates="topics")
    sessions = relationship("TutorSession", back_populates="topic")
    masteries = relationship("StudentMastery", back_populates="topic")
    misconceptions = relationship("StudentMisconception", back_populates="topic")


class TopicPrerequisite(Base):
    __tablename__ = "topic_prerequisites"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    prerequisite_topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)


class TutorSession(Base):
    __tablename__ = "tutor_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    
    current_strategy = Column(String(100), default="Socratic Teaching")
    current_difficulty = Column(String(50), default="Intermediate")
    mode = Column(String(50), default="Learn")  # Learn, Practice, Revise, Apply, Build, Prepare, Diagnose
    status = Column(String(50), default="active")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="sessions")
    topic = relationship("Topic", back_populates="sessions")
    messages = relationship("SessionMessage", back_populates="session", cascade="all, delete-orphan", order_by="SessionMessage.timestamp")


class SessionMessage(Base):
    __tablename__ = "session_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("tutor_sessions.id"), nullable=False)
    sender = Column(String(20), nullable=False)  # "student" or "tutor" or "system"
    content = Column(Text, nullable=False)
    
    strategy_used = Column(String(100), nullable=True)
    cognitive_level = Column(String(50), nullable=True) # Recognition, Understanding, Application, Mastery
    misconception_detected = Column(String(255), nullable=True)
    
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("TutorSession", back_populates="messages")


class StudentMastery(Base):
    __tablename__ = "student_mastery"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    
    recognition_score = Column(Float, default=0.0)    # 0 - 100
    understanding_score = Column(Float, default=0.0)  # 0 - 100
    application_score = Column(Float, default=0.0)    # 0 - 100
    mastery_score = Column(Float, default=0.0)        # 0 - 100
    overall_score = Column(Float, default=0.0)        # 0 - 100
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="masteries")
    topic = relationship("Topic", back_populates="masteries")


class StudentMisconception(Base):
    __tablename__ = "student_misconceptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    trigger_mistake = Column(Text, nullable=True)
    counter_strategy = Column(String(100), default="Compare-and-Contrast Teaching")
    status = Column(String(50), default="Active")  # Active, Addressed, Resolved
    occurrences = Column(Integer, default=1)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="misconceptions")
    topic = relationship("Topic", back_populates="misconceptions")
