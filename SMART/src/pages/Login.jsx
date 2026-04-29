import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import BackButton from '../components/BackButton'
import { useState } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const { login, loginDoctor, addToast } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('patient') // 'patient' or 'doctor'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.loginEmail.value.trim()
    const pwd = e.target.loginPwd.value.trim()

    if (!email || !pwd) {
      addToast('Please enter your email and password.', 'err')
      return
    }

    if (role === 'patient') {
      if (login(email, pwd)) {
        addToast('Signed in successfully. Welcome back!', 'ok')
        setTimeout(() => navigate('/dashboard/overview'), 400)
      } else {
        addToast('Incorrect email or password. Please try again.', 'err')
      }
    } else {
      if (loginDoctor(email, pwd)) {
        addToast('Doctor login successful! Accessing portal...', 'ok')
        setTimeout(() => navigate('/doctor-portal'), 400)
      } else {
        addToast('Invalid doctor credentials.', 'err')
      }
    }
  }

  const toggleEye = () => {
    const input = document.getElementById('loginPwdInput')
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password'
      setShowPassword(!showPassword)
    }
  }

  return (
    <>
      <nav id="mainNav">
        <a className="nav-logo" onClick={() => navigate('/')}>
          <div className="nav-logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          Smart Healthcare System
        </a>
      </nav>

      <div className="auth-page active">
        <div className="auth-left">
          <div className="al-grid"></div>
          <div className="al-blob alb1"></div>
          <div className="al-blob alb2"></div>
          <div className="al-inner">
            <div className="al-brand">
              <div className="al-brand-icon"><svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div>
              <span className="al-brand-name">Smart Healthcare System</span>
            </div>
            <h2 className="al-title">{role === 'patient' ? 'Welcome back to your health portal' : 'Welcome to the Professional Portal'}</h2>
            <p className="al-desc">{role === 'patient' ? 'Sign in to access your medical dashboard, upcoming appointments, and health records.' : 'Access patient records, manage your schedule, and provide expert care.'}</p>
            <div className="al-points">
              <div className="al-pt"><div className="al-pt-icon"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div><span className="al-pt-txt">100% secure and encrypted access</span></div>
              <div className="al-pt"><div className="al-pt-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div><span className="al-pt-txt">{role === 'patient' ? 'View and manage all your appointments' : 'Manage your professional schedule'}</span></div>
              <div className="al-pt"><div className="al-pt-icon"><svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div><span className="al-pt-txt">{role === 'patient' ? 'Real-time health monitoring dashboard' : 'Patient monitoring and risk prediction'}</span></div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="af-box">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', padding: '4px', background: '#f1f5f9', borderRadius: '12px' }}>
              <button 
                onClick={() => setRole('patient')}
                style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: '0.3s', background: role === 'patient' ? 'white' : 'transparent', color: role === 'patient' ? '#1d4ed8' : '#64748b', boxShadow: role === 'patient' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}
              >
                Patient Login
              </button>
              <button 
                onClick={() => setRole('doctor')}
                style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: '0.3s', background: role === 'doctor' ? 'white' : 'transparent', color: role === 'doctor' ? '#1d4ed8' : '#64748b', boxShadow: role === 'doctor' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}
              >
                Doctor Login
              </button>
            </div>

            <h2 className="af-title">{role === 'patient' ? 'Sign In' : 'Doctor Sign In'}</h2>
            <p className="af-sub">Enter your registered credentials to access the {role === 'patient' ? 'portal' : 'professional dashboard'}.</p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-lbl">Email Address</label>
                <div className="fi-wrap">
                  <div className="fi-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div>
                  <input type="email" name="loginEmail" placeholder={role === 'patient' ? "you@example.com" : "priya@smartcare.com"} autoComplete="email" required />
                </div>
              </div>

              <div className="field">
                <label className="field-lbl">Password</label>
                <div className="fi-wrap">
                  <div className="fi-icon"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></div>
                  <input type="password" id="loginPwdInput" name="loginPwd" placeholder="Enter your password" required />
                  <button className="eye-btn" onClick={toggleEye} type="button">
                    <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                </div>
              </div>

              <button className="btn-auth" type="submit">
                <div className="btn-sp"></div>
                <span className="btn-txt">{role === 'patient' ? 'Sign In' : 'Login as Doctor'}</span>
                <svg className="btn-arr" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </form>

            <div className="auth-div">or</div>
            {role === 'patient' ? (
              <div className="auth-sw">Don't have an account? <a onClick={() => navigate('/register')}>Create one now</a></div>
            ) : (
              <div className="auth-sw" style={{ color: '#94a3b8' }}>Doctor registration is managed by hospital admin.</div>
            )}
            <div className="auth-sw" style={{ marginTop: '.5rem' }}><a onClick={() => navigate('/')} style={{ color: 'var(--gray-400)', fontWeight: '600' }}>Back to Home</a></div>
            <BackButton />
          </div>
        </div>
      </div>
    </>
  )
}
