import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import (
    UserProfile, SubmitAnswer, QuizRequest,
    MockTestRequest, PlanResponse, QuestionResponse,
    AnalysisResponse, ReviewItem
)
from db import (
    init_db, save_user, get_user, save_plan, get_latest_plan,
    save_answer, get_topic_stats, upsert_card, get_due_cards
)
from ai import (
    generate_study_plan, generate_question,
    analyze_weaknesses, generate_mock_test
)
from sm2 import sm2

app = FastAPI(title="AI Learning System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

# --- Profile ---

@app.post("/api/profile")
def create_profile(profile: UserProfile):
    save_user(profile.model_dump())
    return {"status": "ok", "user_id": profile.user_id}

@app.get("/api/profile/{user_id}")
def read_profile(user_id: str):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Study plan ---

@app.post("/api/plan", response_model=PlanResponse)
def create_plan(profile: UserProfile):
    save_user(profile.model_dump())
    plan = generate_study_plan(profile.goal, profile.level, profile.days_available)
    save_plan(profile.user_id, json.dumps(plan))
    return PlanResponse(user_id=profile.user_id, plan=plan)

@app.get("/api/plan/{user_id}")
def get_plan(user_id: str):
    raw = get_latest_plan(user_id)
    if not raw:
        raise HTTPException(status_code=404, detail="No plan found")
    return {"user_id": user_id, "plan": json.loads(raw)}

# --- Quiz ---

@app.post("/api/quiz", response_model=QuestionResponse)
def get_question(req: QuizRequest):
    question = generate_question(req.topic, req.level)
    return QuestionResponse(**question)

@app.post("/api/submit")
def submit_answer(req: SubmitAnswer):
    save_answer(
        req.user_id, req.topic, req.question,
        req.user_answer, req.correct_answer, req.quality
    )

    cards = get_due_cards(req.user_id)
    existing = next((c for c in cards if c["question"] == req.question), None)

    easiness    = existing["easiness"]    if existing else 2.5
    interval    = existing["interval"]    if existing else 1
    repetitions = existing["repetitions"] if existing else 0

    new_e, new_i, new_r, due_date = sm2(easiness, interval, repetitions, req.quality)
    upsert_card(req.user_id, req.topic, req.question, new_e, new_i, new_r, due_date)

    return {
        "is_correct": req.quality >= 3,
        "next_review": due_date,
        "interval_days": new_i
    }

# --- Spaced repetition review ---

@app.get("/api/review/{user_id}")
def get_review(user_id: str):
    cards = get_due_cards(user_id)
    return {"due_count": len(cards), "cards": cards}

# --- Weakness analysis ---

@app.get("/api/analysis/{user_id}", response_model=AnalysisResponse)
def get_analysis(user_id: str):
    stats = get_topic_stats(user_id)
    if not stats:
        raise HTTPException(status_code=404, detail="No answers yet")
    result = analyze_weaknesses(stats)
    return AnalysisResponse(**result)

# --- Mock test ---

@app.post("/api/mock-test")
def create_mock_test(req: MockTestRequest):
    user = get_user(req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    stats = get_topic_stats(req.user_id)
    analysis = analyze_weaknesses(stats) if stats else {"weak_topics": []}
    weak_topics = analysis.get("weak_topics", [])

    questions = generate_mock_test(weak_topics, user["level"], req.num_questions)
    return {"questions": questions, "total": len(questions)}