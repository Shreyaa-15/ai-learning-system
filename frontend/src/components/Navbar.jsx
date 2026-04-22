import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/plan',       label: 'Study Plan' },
  { to: '/quiz',       label: 'Quiz' },
  { to: '/dashboard',  label: 'Dashboard' },
  { to: '/mock-test',  label: 'Mock Test' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      background: '#1e1e2e',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <span style={{ color: '#cba6f7', fontWeight: 700, fontSize: '1.1rem' }}>
        AI Learner
      </span>
      {links.map(l => (
        <Link key={l.to} to={l.to} style={{
          color: pathname === l.to ? '#cba6f7' : '#cdd6f4',
          textDecoration: 'none',
          fontWeight: pathname === l.to ? 600 : 400,
          borderBottom: pathname === l.to ? '2px solid #cba6f7' : '2px solid transparent',
          paddingBottom: '2px'
        }}>
          {l.label}
        </Link>
      ))}
    </nav>
  )
}