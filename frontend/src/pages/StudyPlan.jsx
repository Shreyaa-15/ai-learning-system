import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlan } from '../api'

export default function StudyPlan() {
  const [plan, setPlan] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const userId = localStorage.getItem('user_id') || 'u1'

  useEffect(() => {
    getPlan(userId)
      .then(r => setPlan(r.data.plan))
      .catch(() => navigate('/onboarding'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: '#a6adc8' }}>Loading your plan...</p>

  return (
    <div>
      <h1 style={{ color: '#cba6f7', marginBottom: '0.5rem' }}>Your Study Plan</h1>
      <p style={{ color: '#a6adc8', marginBottom: '2rem' }}>
        {plan.length} days mapped out for you.
      </p>

      {plan.map(day => (
        <div key={day.day} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#cba6f7', fontWeight: 700 }}>Day {day.day}</span>
            <span style={{ color: '#a6adc8', fontSize: '0.85rem' }}>
              ~{day.estimated_hours}h
            </span>
          </div>
          <h3 style={{ color: '#cdd6f4', margin: '0.4rem 0' }}>{day.topic}</h3>
          <ul style={{ color: '#a6adc8', paddingLeft: '1.2rem', margin: 0 }}>
            {day.subtopics?.map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
          </ul>
          <button
            onClick={() => navigate(`/quiz?topic=${encodeURIComponent(day.topic)}`)}
            style={{ ...smallBtn, marginTop: '0.8rem' }}
          >
            Practice this topic →
          </button>
        </div>
      ))}
    </div>
  )
}

const cardStyle = {
  background: '#313244', border: '1px solid #45475a',
  borderRadius: 10, padding: '1.2rem',
  marginBottom: '1rem'
}

const smallBtn = {
  background: 'transparent', border: '1px solid #cba6f7',
  color: '#cba6f7', borderRadius: 6,
  padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.9rem'
}