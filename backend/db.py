import sqlite3
from datetime import date

DB_PATH = "learning.db"

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            user_id         TEXT PRIMARY KEY,
            name            TEXT NOT NULL,
            goal            TEXT NOT NULL,
            level           TEXT NOT NULL,
            days_available  INTEGER NOT NULL,
            created_at      TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS study_plans (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     TEXT NOT NULL,
            plan_json   TEXT NOT NULL,
            created_at  TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS answers (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id         TEXT NOT NULL,
            topic           TEXT NOT NULL,
            question        TEXT NOT NULL,
            user_answer     TEXT NOT NULL,
            correct_answer  TEXT NOT NULL,
            is_correct      INTEGER NOT NULL,
            quality         INTEGER NOT NULL,
            answered_at     TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sm2_cards (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     TEXT NOT NULL,
            topic       TEXT NOT NULL,
            question    TEXT NOT NULL,
            easiness    REAL DEFAULT 2.5,
            interval    INTEGER DEFAULT 1,
            repetitions INTEGER DEFAULT 0,
            due_date    TEXT NOT NULL
        );
    """)
    conn.commit()
    conn.close()

# --- Users ---

def save_user(profile: dict):
    conn = get_conn()
    conn.execute("""
        INSERT INTO users (user_id, name, goal, level, days_available)
        VALUES (:user_id, :name, :goal, :level, :days_available)
        ON CONFLICT(user_id) DO UPDATE SET
            goal=excluded.goal,
            level=excluded.level,
            days_available=excluded.days_available
    """, profile)
    conn.commit()
    conn.close()

def get_user(user_id: str):
    conn = get_conn()
    row = conn.execute("SELECT * FROM users WHERE user_id=?", (user_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

# --- Study plans ---

def save_plan(user_id: str, plan_json: str):
    conn = get_conn()
    conn.execute(
        "INSERT INTO study_plans (user_id, plan_json) VALUES (?, ?)",
        (user_id, plan_json)
    )
    conn.commit()
    conn.close()

def get_latest_plan(user_id: str):
    conn = get_conn()
    row = conn.execute(
        "SELECT plan_json FROM study_plans WHERE user_id=? ORDER BY created_at DESC LIMIT 1",
        (user_id,)
    ).fetchone()
    conn.close()
    return row["plan_json"] if row else None

# --- Answers ---

def save_answer(user_id: str, topic: str, question: str,
                user_answer: str, correct_answer: str, quality: int):
    is_correct = 1 if quality >= 3 else 0
    conn = get_conn()
    conn.execute("""
        INSERT INTO answers (user_id, topic, question, user_answer, correct_answer, is_correct, quality)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, topic, question, user_answer, correct_answer, is_correct, quality))
    conn.commit()
    conn.close()

def get_topic_stats(user_id: str):
    conn = get_conn()
    rows = conn.execute("""
        SELECT topic,
               COUNT(*) as total,
               SUM(is_correct) as correct
        FROM answers
        WHERE user_id=?
        GROUP BY topic
    """, (user_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# --- SM-2 cards ---

def upsert_card(user_id: str, topic: str, question: str,
                easiness: float, interval: int, repetitions: int, due_date: str):
    conn = get_conn()
    existing = conn.execute(
        "SELECT id FROM sm2_cards WHERE user_id=? AND question=?",
        (user_id, question)
    ).fetchone()

    if existing:
        conn.execute("""
            UPDATE sm2_cards
            SET easiness=?, interval=?, repetitions=?, due_date=?
            WHERE user_id=? AND question=?
        """, (easiness, interval, repetitions, due_date, user_id, question))
    else:
        conn.execute("""
            INSERT INTO sm2_cards (user_id, topic, question, easiness, interval, repetitions, due_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, topic, question, easiness, interval, repetitions, due_date))

    conn.commit()
    conn.close()

def get_due_cards(user_id: str):
    today = date.today().isoformat()
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM sm2_cards WHERE user_id=? AND due_date<=?",
        (user_id, today)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]