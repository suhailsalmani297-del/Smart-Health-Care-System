import React, { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Sidebar from '../components/Sidebar'
import ProfileModal from '../components/ProfileModal'
import Overview from './Overview'
import Predict from './Predict'
import Diet from './Diet'
import Exercise from './Exercise'
import Chatbot from './Chatbot'
import Appointments from './Appointments'
import BackButton from '../components/BackButton'

export default function Dashboard() {
  const { page } = useParams()
  const { user, logout, addToast } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showProfile, setShowProfile] = useState(false)

  if (!user) {
    return <Navigate to="/" replace />
  }

  const pageMap = {
    overview: <Overview user={user} />,
    predict: <Predict />,
    diet: <Diet />,
    exercise: <Exercise />,
    appointments: <Appointments user={user} addToast={addToast} />,
    chatbot: <Chatbot />,
  }

  const currentPage = pageMap[page] || <Navigate to="/dashboard/overview" replace />

  const getPageTitle = () => {
    const titles = {
      overview: 'Dashboard Overview',
      predict: 'AI Risk Prediction',
      diet: 'Diet Plans',
      exercise: 'Exercise Plans',
      appointments: 'Book Appointments',
      chatbot: 'AI Health Chatbot',
    }
    return titles[page] || 'Dashboard'
  }

  return (
    <div className="app-container">
      {/* Toasts */}
      <div id="toastBox"></div>

      <div className="ds-layout">
        <Sidebar onLogout={logout} user={user} isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="ds-main">
          <div className="ds-topbar">
            <div className="ds-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {!isSidebarOpen && (
                <button className="ds-hamburger-top" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              )}
              <div className="ds-topbar-title">{getPageTitle()}</div>
            </div>
            <div className="ds-topbar-right" onClick={() => setShowProfile(true)} style={{ cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
              <div className="ds-topbar-avatar">
                {user?.dp ? (
                  <img src={user.dp} alt="DP" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <span className="ds-topbar-name">{user?.name}</span>
            </div>
          </div>
          <div className="ds-content">
            {currentPage}
            <BackButton />
          </div>
        </main>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  )
}
