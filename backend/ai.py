import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

def _ask(prompt: str) -> str:
    """Base helper — all functions go through here."""
    response = model.generate_content(prompt)
    text = response.text.strip()
    # Strip markdown code fences if Gemini adds them
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return text.strip()

def generate_study_plan(goal: str, level: str, days: int) -> list[dict]:
    prompt = f"""
Create a {days}-day study plan for: {goal}
Student level: {level}

Return ONLY valid JSON — no explanation, no markdown, no code fences.
Format:
[
  {{
    "day": 1,
    "topic": "Topic name",
    "subtopics": ["subtopic 1", "subtopic 2"],
    "estimated_hours": 2
  }}
]
"""
    raw = _ask(prompt)
    return json.loads(raw)

def generate_question(topic: str, level: str) -> dict:
    prompt = f"""
Generate one multiple choice question on: {topic}
Difficulty: {level}

Return ONLY valid JSON — no explanation, no markdown, no code fences.
Format:
{{
  "question": "Question text here?",
  "options": ["A. option", "B. option", "C. option", "D. option"],
  "answer": "A. option",
  "explanation": "Why this is correct."
}}
"""
    raw = _ask(prompt)
    return json.loads(raw)

def analyze_weaknesses(topic_stats: list[dict]) -> dict:
    prompt = f"""
A student has the following quiz performance by topic:
{json.dumps(topic_stats, indent=2)}

Each entry has: topic, total (questions attempted), correct (questions right).

Analyze and return ONLY valid JSON — no explanation, no markdown, no code fences.
Format:
{{
  "weak_topics": ["topic1", "topic2"],
  "strong_topics": ["topic3"],
  "recommendation": "One paragraph of specific advice."
}}
"""
    raw = _ask(prompt)
    return json.loads(raw)

def generate_mock_test(weak_topics: list[str], level: str, num_questions: int) -> list[dict]:
    topics_str = ", ".join(weak_topics) if weak_topics else "general topics"
    prompt = f"""
Generate {num_questions} multiple choice questions focused on: {topics_str}
Difficulty: {level}

Return ONLY a valid JSON array — no explanation, no markdown, no code fences.
Format:
[
  {{
    "topic": "topic name",
    "question": "Question text?",
    "options": ["A. option", "B. option", "C. option", "D. option"],
    "answer": "A. option",
    "explanation": "Why correct."
  }}
]
"""
    raw = _ask(prompt)
    return json.loads(raw)