import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import BackButton from '../components/BackButton'
import { useState } from 'react'

export default function Register() {
  const navigate = useNavigate()
  const { register, registerDoctor, addToast, sendOtp, verifyOtp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('patient') // 'patient' or 'doctor'
  const [showOtp, setShowOtp] = useState(false)
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [tempData, setTempData] = useState(null)
  const [timer, setTimer] = useState(0)
  const [loading, setLoading] = useState(false)

  const startTimer = () => {
    setTimer(60)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1)
    const newOtp = [...otpCode]
    newOtp[index] = value
    setOtpCode(newOtp)

    // Auto-focus next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = e.target.regName.value.trim()
    const email = e.target.regEmail.value.trim()
    const pwd = e.target.regPwd.value.trim()
    const spec = e.target.regSpec ? e.target.regSpec.value.trim() : ''

    if (!name || !email || !pwd || (role === 'doctor' && !spec)) {
      addToast('Please complete all required fields.', 'err')
      return
    }

    setTempData({ name, email, pwd, spec, role })
    setLoading(true)
    const otpSent = await sendOtp(email)
    setLoading(false)
    if (otpSent) {
      setShowOtp(true)
      startTimer()
      addToast('Verification code sent to your email.', 'ok')
    }
  }

  const handleVerifyOtp = async () => {
    const code = otpCode.join('')
    if (code.length < 6) {
      addToast('Please enter the full 6-digit code.', 'err')
      return
    }

    const verified = await verifyOtp(tempData.email, code)
    if (verified) {
      let success = false
      if (tempData.role === 'patient') {
        success = await register(tempData.name, tempData.email, tempData.pwd)
      } else {
        success = await registerDoctor(tempData.name, tempData.email, tempData.pwd, tempData.spec)
      }

      if (success) {
        setShowOtp(false)
        addToast('Account created successfully!', 'ok')
        setTimeout(() => navigate('/login'), 1200)
      }
    }
  }

  const resendOtp = async () => {
    if (timer > 0) return
    const otpSent = await sendOtp(tempData.email)
    if (otpSent) {
      startTimer()
      addToast('New verification code sent.', 'ok')
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
            <h2 className="al-title">{role === 'patient' ? 'Start your health journey with us today' : 'Join our network of medical professionals'}</h2>
            <p className="al-desc">{role === 'patient' ? 'Create your free account and access world-class healthcare, specialist doctors, and a personalised wellness dashboard.' : 'Register to provide expert care, manage your professional schedule, and reach more patients.'}</p>
            <div className="al-points">
              <div className="al-pt"><div className="al-pt-icon"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div><span className="al-pt-txt">{role === 'patient' ? 'Personal health profile and records' : 'Professional profile and reputation'}</span></div>
              <div className="al-pt"><div className="al-pt-icon"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div><span className="al-pt-txt">{role === 'patient' ? 'Direct messaging with your doctor' : 'Direct communication with patients'}</span></div>
              <div className="al-pt"><div className="al-pt-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div><span className="al-pt-txt">24/7 access to your health portal</span></div>
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
                Patient Register
              </button>
              <button 
                onClick={() => setRole('doctor')}
                style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: '0.3s', background: role === 'doctor' ? 'white' : 'transparent', color: role === 'doctor' ? '#1d4ed8' : '#64748b', boxShadow: role === 'doctor' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}
              >
                Doctor Register
              </button>
            </div>

            <h2 className="af-title">{role === 'patient' ? 'Create Account' : 'Doctor Registration'}</h2>
            <p className="af-sub">{role === 'patient' ? 'Fill in your details below to get started. It only takes a minute.' : 'Register as a certified medical professional to start your practice.'}</p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-lbl">Full Name</label>
                <div className="fi-wrap">
                  <div className="fi-icon"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div>
                  <input type="text" name="regName" placeholder={role === 'patient' ? "John Doe" : "Dr. John Doe"} required />
                </div>
              </div>

              {role === 'doctor' && (
                <div className="field">
                  <label className="field-lbl">Specialization</label>
                  <div className="fi-wrap">
                    <div className="fi-icon"><svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div>
                    <select name="regSpec" className="input-field" style={{ border: 'none', background: 'transparent', paddingLeft: '0' }} required>
                      <option value="">Select Specialty</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Orthopedist">Orthopedist</option>
                      <option value="Pediatrician">Pediatrician</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="field">
                <label className="field-lbl">Email Address</label>
                <div className="fi-wrap">
                  <div className="fi-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div>
                  <input type="email" name="regEmail" placeholder="you@example.com" autoComplete="email" required />
                </div>
              </div>

              <div className="field">
                <label className="field-lbl">Password</label>
                <div className="fi-wrap">
                  <div className="fi-icon"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></div>
                  <input type={showPassword ? "text" : "password"} id="regPwdInput" name="regPwd" placeholder="Create a password" required />
                  <button className="eye-btn" onClick={() => setShowPassword(!showPassword)} type="button" title={showPassword ? "Hide Password" : "Show Password"}>
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <button className="btn-auth" type="submit" disabled={loading}>
                <div className="btn-sp"></div>
                <span className="btn-txt">{loading ? 'Loading...' : (role === 'patient' ? 'Create Account' : 'Register as Doctor')}</span>
                {!loading && <svg className="btn-arr" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>}
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

            <div className="auth-sw">Already have an account? <a onClick={() => navigate('/login')}>Sign in here</a></div>
            <div className="auth-sw" style={{ marginTop: '.5rem' }}><a onClick={() => navigate('/')} style={{ color: 'var(--gray-400)', fontWeight: '600' }}>Back to Home</a></div>
            <BackButton />
          </div>
        </div>
      </div>

      {showOtp && (
        <div className="otp-overlay">
          <div className="otp-card">
            <h2 className="otp-title">Verify your email</h2>
            <p className="otp-sub">We've sent a 6-digit verification code to <br /><strong>{tempData?.email}</strong></p>
            
            <div className="otp-inputs">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength="1"
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <div 
              className={`otp-resend ${timer > 0 ? 'disabled' : ''}`} 
              onClick={resendOtp}
            >
              {timer > 0 ? `Resend code in ${timer}s` : 'Didn\'t receive a code? Resend'}
            </div>

            <button className="otp-btn" onClick={handleVerifyOtp}>
              Verify & Register
            </button>
            <button 
              className="btn-ghost" 
              style={{ width: '100%', marginTop: '10px', border: 'none', background: 'transparent', color: '#71717a' }}
              onClick={() => setShowOtp(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
