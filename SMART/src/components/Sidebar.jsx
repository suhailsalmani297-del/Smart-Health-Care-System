import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'predict',
    label: 'Risk Predict',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 'diet',
    label: 'Diet Plans',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
  {
    id: 'exercise',
    label: 'Exercise',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5a5 5 0 0 1 7.07 0l.43.43.43-.43a5 5 0 0 1 7.07 7.07l-7.5 7.5-7.5-7.5a5 5 0 0 1 0-7.07z"/>
      </svg>
    ),
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'chatbot',
    label: 'AI Chatbot',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

export default function Sidebar({ onLogout, user, isOpen, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()

  const getActivePage = () => {
    const path = location.pathname
    const match = path.match(/\/dashboard\/(\w+)/)
    return match ? match[1] : 'overview'
  }

  const activePage = getActivePage()

  const handleNavigate = (pageId) => {
    navigate(`/dashboard/${pageId}`)
    window.scrollTo(0, 0)
  }

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <aside className="ds-sidebar" style={{ display: isOpen ? 'flex' : 'none' }}>
      {/* Brand */}
      <div className="ds-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="ds-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span className="ds-brand-name">HealthGuard</span>
        </div>
        <button className="ds-hamburger-side" onClick={onToggle} style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', padding: '0.2rem' }}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* User pill */}
      <div className="ds-user-pill">
        <div className="ds-avatar">
          {user?.dp ? (
            <img src={user.dp} alt="DP" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="ds-user-info">
          <div className="ds-user-name">{user?.name}</div>
          <div className="ds-user-role">Patient</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="ds-nav">
        <div className="ds-nav-section">Main Menu</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`ds-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => handleNavigate(item.id)}
          >
            <span className="ds-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {activePage === item.id && <span className="ds-nav-dot" />}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button className="ds-logout" onClick={handleLogout}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign Out
      </button>
    </aside>
  )
}

