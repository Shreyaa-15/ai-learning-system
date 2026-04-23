# AI Personalized Learning System

An intelligent, adaptive learning platform that generates personalized study plans, quizzes, and weakness analysis using Google Gemini AI.

## Features
- AI-generated study plans tailored to your goal and level
- Adaptive MCQ quiz with instant feedback and explanations
- Spaced repetition engine (SM-2 algorithm) for optimal review scheduling
- Weakness analysis and AI-powered recommendations
- Mock test generator weighted toward weak topics

## Tech Stack
- **Frontend:** React, Vite, React Router
- **Backend:** FastAPI (Python)
- **AI:** Google Gemini 2.0
- **Database:** SQLite
- **Algorithm:** SM-2 Spaced Repetition

## Architecture
- REST API backend with 9 endpoints
- AI layer fully decoupled from business logic
- SM-2 algorithm schedules next review based on recall quality (0–5 scale)

## Run Locally

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Environment Variables
Create `backend/.env`:

Get a free key at https://aistudio.google.com

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/plan | Generate AI study plan |
| POST | /api/quiz | Get a quiz question |
| POST | /api/submit | Submit answer + update SM-2 |
| GET | /api/analysis/{user_id} | Weakness analysis |
| GET | /api/review/{user_id} | Due cards for review |
| POST | /api/mock-test | Generate mock test |