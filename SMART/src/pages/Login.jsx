import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import BackButton from '../components/BackButton'
import { useState, useEffect, useRef } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginDoctor, addToast, setUser, setDoctor, user, doctor } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('patient') // 'patient' or 'doctor'
  const hasProcessedOAuth = useRef(false);

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      navigate('/dashboard/overview');
      return;
    }
    if (doctor) {
      navigate('/doctor-portal');
      return;
    }

    // Handle OAuth redirect
    if (hasProcessedOAuth.current) return;

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const roleParam = params.get('role');
    const errorParam = params.get('error');

    if (errorParam || (token && roleParam)) {
      hasProcessedOAuth.current = true;
      // Clear the URL parameters immediately using window.history to prevent loop
      window.history.replaceState({}, document.title, window.location.pathname);
      
      if (errorParam) {
        addToast('Authentication failed. Please try again.', 'err');
      } else {
        const name = params.get('name') || '';
        const email = params.get('email') || '';
        const userData = { _id: 'oauth', name, email, role: roleParam };

        if (roleParam === 'patient') {
          setUser(userData);
          sessionStorage.setItem('shs_user', JSON.stringify(userData));
          localStorage.setItem('shs_token', token);
          navigate('/dashboard/overview');
        } else {
          setDoctor(userData);
          sessionStorage.setItem('shs_doc', JSON.stringify(userData));
          localStorage.setItem('shs_doc_token', token);
          navigate('/doctor-portal');
        }
      }
    }
  }, [location.search, navigate, setUser, setDoctor, addToast, user, doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.loginEmail.value.trim()
    const pwd = e.target.loginPwd.value.trim()

    if (!email || !pwd) {
      addToast('Please enter your email and password.', 'err')
      return
    }

    if (role === 'patient') {
      const success = await login(email, pwd)
      if (success) {
        addToast('Signed in successfully. Welcome back!', 'ok')
        navigate('/dashboard/overview')
      } else {
        addToast('Incorrect email or password. Please try again.', 'err')
      }
    } else {
      const result = await loginDoctor(email, pwd)
      if (result) {
        addToast('Doctor login successful! Accessing portal...', 'ok')
        navigate('/doctor-portal')
      } else {
        // AuthContext handles the specific error toast now
      }
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
                  <input type={showPassword ? "text" : "password"} id="loginPwdInput" name="loginPwd" placeholder="Enter your password" required />
                  <button className="eye-btn" onClick={() => setShowPassword(!showPassword)} type="button" title={showPassword ? "Hide Password" : "Show Password"}>
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
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
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button 
                type="button" 
                onClick={() => window.location.href = `http://localhost:5001/api/auth/google?role=${role}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', color: '#334155' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
              <button 
                type="button" 
                onClick={() => window.location.href = `http://localhost:5001/api/auth/github?role=${role}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: '#24292e', border: '1px solid #24292e', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', color: '#fff' }}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"/></svg>
                Continue with GitHub
              </button>
            </div>

            <div className="auth-sw">Don't have an account? <a onClick={() => navigate('/register')}>Create one now</a></div>
            <div className="auth-sw" style={{ marginTop: '.5rem' }}><a onClick={() => navigate('/')} style={{ color: 'var(--gray-400)', fontWeight: '600' }}>Back to Home</a></div>
            <BackButton />
          </div>
        </div>
      </div>
    </>
  )
}
