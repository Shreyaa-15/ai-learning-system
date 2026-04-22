import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPlan } from '../api'

export default function Onboarding() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    user_id: 'u1',
    name: '',
    goal: '',
    level: 'beginner',
    days_available: 7
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.goal) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await createPlan({ ...form, days_available: Number(form.days_available) })
      localStorage.setItem('user_id', form.user_id)
      localStorage.setItem('level', form.level)
      navigate('/plan')
    } catch (e) {
      setError('Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ color: '#cba6f7', marginBottom: '0.5rem' }}>Welcome 👋</h1>
      <p style={{ color: '#a6adc8', marginBottom: '2rem' }}>
        Tell us about yourself and we'll build your personal study plan.
      </p>

      {error && <p style={{ color: '#f38ba8', marginBottom: '1rem' }}>{error}</p>}

      {[
        { label: 'Your name', name: 'name', type: 'text', placeholder: 'Shreya' },
        { label: 'Your goal', name: 'goal', type: 'text', placeholder: 'DSA for interviews / GATE CSE' },
        { label: 'Days available', name: 'days_available', type: 'number', placeholder: '7' },
      ].map(field => (
        <div key={field.name} style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', color: '#cdd6f4', marginBottom: '0.4rem' }}>
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
      ))}

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', color: '#cdd6f4', marginBottom: '0.4rem' }}>
          Current level
        </label>
        <select name="level" value={form.level} onChange={handleChange} style={inputStyle}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <button onClick={handleSubmit} disabled={loading} style={btnStyle}>
        {loading ? 'Building your plan...' : 'Generate Study Plan →'}
      </button>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '0.7rem 1rem',
  background: '#313244', border: '1px solid #45475a',
  borderRadius: 8, color: '#cdd6f4', fontSize: '1rem',
  boxSizing: 'border-box'
}

const btnStyle = {
  background: '#cba6f7', color: '#1e1e2e',
  border: 'none', borderRadius: 8,
  padding: '0.8rem 2rem', fontSize: '1rem',
  fontWeight: 700, cursor: 'pointer'
}