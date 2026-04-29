import { Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { useAuth } from './AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DoctorPortal from './pages/DoctorPortal'
import { ProtectedRoute } from './ProtectedRoute'

function App() {
  const { toasts } = useAuth()

  return (
    <div className="app-container">
      {/* TOASTS */}
      <div id="toastBox">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {t.type === 'ok' && <path d="M20 6L9 17l-5-5" />}
              {t.type === 'err' && (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              )}
              {t.type === 'info' && (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              )}
            </svg>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor-portal" element={<DoctorPortal />} />
        <Route
          path="/dashboard/:page?"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
