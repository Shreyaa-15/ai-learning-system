from pydantic import BaseModel
from typing import Literal

# --- Requests ---

class UserProfile(BaseModel):
    user_id: str
    name: str
    goal: str
    level: Literal["beginner", "intermediate", "advanced"]
    days_available: int

class SubmitAnswer(BaseModel):
    user_id: str
    topic: str
    question: str
    user_answer: str
    correct_answer: str
    quality: int

class QuizRequest(BaseModel):
    user_id: str
    topic: str
    level: Literal["beginner", "intermediate", "advanced"]

class MockTestRequest(BaseModel):
    user_id: str
    num_questions: int = 10

# --- Responses ---

class PlanResponse(BaseModel):
    user_id: str
    plan: list[dict]

class QuestionResponse(BaseModel):
    topic: str
    question: str
    options: list[str]
    answer: str
    explanation: str

class AnalysisResponse(BaseModel):
    weak_topics: list[str]
    strong_topics: list[str]
    recommendation: str

class ReviewItem(BaseModel):
    topic: str
    question: str
    due_date: str