import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Onboarding from './pages/Onboarding'
import StudyPlan from './pages/StudyPlan'
import Quiz from './pages/Quiz'
import Dashboard from './pages/Dashboard'
import MockTest from './pages/MockTest'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
        <Routes>
          <Route path="/"            element={<Navigate to="/onboarding" />} />
          <Route path="/onboarding"  element={<Onboarding />} />
          <Route path="/plan"        element={<StudyPlan />} />
          <Route path="/quiz"        element={<Quiz />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/mock-test"   element={<MockTest />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}