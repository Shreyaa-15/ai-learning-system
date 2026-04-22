import { useEffect, useState } from 'react'
import { getAnalysis, getReview } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [analysis, setAnalysis] = useState(null)
  const [review, setReview]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const navigate  = useNavigate()
  const userId = localStorage.getItem('user_id') || 'u1'

  useEffect(() => {
    Promise.all([getAnalysis(userId), getReview(userId)])
      .then(([a, r]) => {
        setAnalysis(a.data)
        setReview(r.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: '#a6adc8' }}>Loading dashboard...</p>

  return (
    <div>
      <h1 style={{ color: '#cba6f7', marginBottom: '2rem' }}>Dashboard</h1>

      {review && (
        <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#89dceb', marginTop: 0 }}>Due for Review</h2>
          <p style={{ color: '#cdd6f4', fontSize: '2rem', fontWeight: 700, margin: 0 }}>
            {review.due_count}
          </p>
          <p style={{ color: '#a6adc8' }}>cards due today</p>
          {review.due_count > 0 && (
            <button onClick={() => navigate('/quiz')} style={btnStyle}>
              Start Review →
            </button>
          )}
        </div>
      )}

      {analysis ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={cardStyle}>
              <h3 style={{ color: '#f38ba8', marginTop: 0 }}>Weak Topics</h3>
              {analysis.weak_topics.length === 0
                ? <p style={{ color: '#a6adc8' }}>None yet — keep quizzing!</p>
                : analysis.weak_topics.map(t => (
                    <div key={t} style={tagStyle('#f38ba8')}>{t}</div>
                  ))
              }
            </div>
            <div style={cardStyle}>
              <h3 style={{ color: '#a6e3a1', marginTop: 0 }}>Strong Topics</h3>
              {analysis.strong_topics.length === 0
                ? <p style={{ color: '#a6adc8' }}>None yet — keep quizzing!</p>
                : analysis.strong_topics.map(t => (
                    <div key={t} style={tagStyle('#a6e3a1')}>{t}</div>
                  ))
              }
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: '#89dceb', marginTop: 0 }}>AI Recommendation</h3>
            <p style={{ color: '#cdd6f4', lineHeight: 1.7, margin: 0 }}>
              {analysis.recommendation}
            </p>
          </div>
        </>
      ) : (
        <div style={cardStyle}>
          <p style={{ color: '#a6adc8', margin: 0 }}>
            No analysis yet — answer some quiz questions first, then come back here.
          </p>
        </div>
      )}
    </div>
  )
}

const cardStyle = {
  background: '#313244', border: '1px solid #45475a',
  borderRadius: 10, padding: '1.2rem'
}
const btnStyle = {
  background: '#cba6f7', color: '#1e1e2e',
  border: 'none', borderRadius: 8,
  padding: '0.6rem 1.2rem', fontWeight: 700,
  cursor: 'pointer', marginTop: '0.5rem'
}
const tagStyle = (color) => ({
  display: 'inline-block', background: color + '22',
  color, border: `1px solid ${color}44`,
  borderRadius: 6, padding: '0.3rem 0.7rem',
  marginRight: '0.5rem', marginBottom: '0.5rem',
  fontSize: '0.9rem'
})