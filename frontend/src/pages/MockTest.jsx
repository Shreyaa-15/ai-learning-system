import { useState } from 'react'
import { createMockTest } from '../api'

export default function MockTest() {
  const userId = localStorage.getItem('user_id') || 'u1'
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers]     = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [numQ, setNumQ]           = useState(5)

  const startTest = async () => {
    setLoading(true)
    setAnswers({})
    setSubmitted(false)
    try {
      const r = await createMockTest({ user_id: userId, num_questions: numQ })
      setQuestions(r.data.questions)
    } finally {
      setLoading(false)
    }
  }

  const select = (i, opt) => {
    if (submitted) return
    setAnswers({ ...answers, [i]: opt })
  }

  const score = questions.filter((q, i) => answers[i] === q.answer).length

  const optionBg = (i, opt) => {
    if (!submitted) return answers[i] === opt ? '#45475a' : 'transparent'
    if (opt === questions[i].answer) return '#a6e3a1'
    if (opt === answers[i])          return '#f38ba8'
    return 'transparent'
  }

  return (
    <div>
      <h1 style={{ color: '#cba6f7', marginBottom: '0.5rem' }}>Mock Test</h1>
      <p style={{ color: '#a6adc8', marginBottom: '1.5rem' }}>
        Questions are weighted toward your weak topics.
      </p>

      {questions.length === 0 && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={numQ}
            onChange={e => setNumQ(Number(e.target.value))}
            style={inputStyle}
          >
            {[5, 10, 15, 20].map(n => (
              <option key={n} value={n}>{n} questions</option>
            ))}
          </select>
          <button onClick={startTest} disabled={loading} style={btnStyle}>
            {loading ? 'Generating...' : 'Start Mock Test'}
          </button>
        </div>
      )}

      {questions.map((q, i) => (
        <div key={i} style={{ ...cardStyle, marginBottom: '1.2rem' }}>
          <p style={{ color: '#89dceb', fontSize: '0.85rem', margin: '0 0 0.4rem' }}>
            Q{i + 1} · {q.topic}
          </p>
          <p style={{ color: '#cdd6f4', fontWeight: 600, marginBottom: '1rem' }}>
            {q.question}
          </p>
          {q.options.map(opt => (
            <div
              key={opt}
              onClick={() => select(i, opt)}
              style={{
                padding: '0.6rem 1rem', borderRadius: 8,
                border: '1px solid #45475a', marginBottom: '0.5rem',
                cursor: submitted ? 'default' : 'pointer',
                background: optionBg(i, opt), color: '#cdd6f4'
              }}
            >
              {opt}
            </div>
          ))}
          {submitted && (
            <p style={{ color: '#a6adc8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {q.explanation}
            </p>
          )}
        </div>
      ))}

      {questions.length > 0 && !submitted && (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < questions.length}
          style={btnStyle}
        >
          Submit Test
        </button>
      )}

      {submitted && (
        <div style={{ ...cardStyle, textAlign: 'center', marginTop: '1rem' }}>
          <h2 style={{ color: '#cba6f7' }}>
            Score: {score} / {questions.length}
          </h2>
          <p style={{ color: '#a6adc8' }}>
            {score === questions.length ? 'Perfect! 🎉' :
             score >= questions.length * 0.7 ? 'Good job! Keep going 💪' :
             'Keep practicing — check your weak topics in Dashboard'}
          </p>
          <button onClick={() => { setQuestions([]); setSubmitted(false) }} style={btnStyle}>
            Try Another Test
          </button>
        </div>
      )}
    </div>
  )
}

const cardStyle = {
  background: '#313244', border: '1px solid #45475a',
  borderRadius: 10, padding: '1.2rem'
}
const inputStyle = {
  padding: '0.7rem 1rem', background: '#313244',
  border: '1px solid #45475a', borderRadius: 8,
  color: '#cdd6f4', fontSize: '1rem'
}
const btnStyle = {
  background: '#cba6f7', color: '#1e1e2e',
  border: 'none', borderRadius: 8,
  padding: '0.7rem 1.6rem', fontWeight: 700,
  cursor: 'pointer', fontSize: '1rem'
}