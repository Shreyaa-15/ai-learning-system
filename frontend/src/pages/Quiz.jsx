import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getQuiz, submitAnswer } from '../api'

export default function Quiz() {
  const [params] = useSearchParams()
  const topic = params.get('topic') || ''
  const userId = localStorage.getItem('user_id') || 'u1'
  const level  = localStorage.getItem('level') || 'intermediate'

  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [topicInput, setTopicInput] = useState(topic)

  const fetchQuestion = async () => {
    setLoading(true)
    setSelected(null)
    setResult(null)
    try {
      const r = await getQuiz({ user_id: userId, topic: topicInput, level })
      setQuestion(r.data)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (option) => {
    if (result) return
    setSelected(option)
    const isCorrect = option === question.answer
    const quality   = isCorrect ? 4 : 1

    const r = await submitAnswer({
      user_id: userId,
      topic: question.topic,
      question: question.question,
      user_answer: option,
      correct_answer: question.answer,
      quality
    })
    setResult({ ...r.data, isCorrect })
  }

  const optionColor = (opt) => {
    if (!result) return selected === opt ? '#45475a' : 'transparent'
    if (opt === question.answer) return '#a6e3a1'
    if (opt === selected)        return '#f38ba8'
    return 'transparent'
  }

  return (
    <div>
      <h1 style={{ color: '#cba6f7', marginBottom: '1.5rem' }}>Quiz</h1>

      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <input
          value={topicInput}
          onChange={e => setTopicInput(e.target.value)}
          placeholder="Enter a topic (e.g. Binary Search)"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={fetchQuestion} disabled={loading} style={btnStyle}>
          {loading ? '...' : 'Get Question'}
        </button>
      </div>

      {question && (
        <div style={cardStyle}>
          <p style={{ color: '#cdd6f4', fontWeight: 600, marginBottom: '1rem', fontSize: '1.05rem' }}>
            {question.question}
          </p>

          {question.options.map(opt => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              style={{
                padding: '0.7rem 1rem', borderRadius: 8,
                border: '1px solid #45475a', marginBottom: '0.6rem',
                cursor: result ? 'default' : 'pointer',
                background: optionColor(opt),
                color: '#cdd6f4', transition: 'background 0.2s'
              }}
            >
              {opt}
            </div>
          ))}

          {result && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#1e1e2e', borderRadius: 8 }}>
              <p style={{ color: result.isCorrect ? '#a6e3a1' : '#f38ba8', fontWeight: 700, margin: 0 }}>
                {result.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p style={{ color: '#a6adc8', marginTop: '0.5rem' }}>{question.explanation}</p>
              <p style={{ color: '#6c7086', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Next review in {result.interval_days} day{result.interval_days !== 1 ? 's' : ''}
              </p>
              <button onClick={fetchQuestion} style={{ ...btnStyle, marginTop: '0.8rem' }}>
                Next Question →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const cardStyle = {
  background: '#313244', border: '1px solid #45475a',
  borderRadius: 10, padding: '1.5rem'
}
const inputStyle = {
  padding: '0.7rem 1rem', background: '#313244',
  border: '1px solid #45475a', borderRadius: 8,
  color: '#cdd6f4', fontSize: '1rem'
}
const btnStyle = {
  background: '#cba6f7', color: '#1e1e2e',
  border: 'none', borderRadius: 8,
  padding: '0.7rem 1.4rem', fontWeight: 700,
  cursor: 'pointer', fontSize: '1rem'
}