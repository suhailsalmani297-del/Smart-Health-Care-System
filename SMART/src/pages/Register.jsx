import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import BackButton from '../components/BackButton'
import { useState } from 'react'

export default function Register() {
  const navigate = useNavigate()
  const { register, registerDoctor, addToast } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('patient') // 'patient' or 'doctor'

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

    if (role === 'patient') {
      if (register(name, email, pwd)) {
        addToast('Account created successfully. You can now sign in.', 'ok')
        e.target.reset()
        setTimeout(() => navigate('/login'), 1200)
      } else {
        addToast('This email is already registered. Please sign in.', 'err')
      }
    } else {
      if (registerDoctor(name, email, pwd, spec)) {
        addToast('Doctor account created successfully!', 'ok')
        e.target.reset()
        setTimeout(() => navigate('/login'), 1200)
      } else {
        addToast('This email is already registered as a doctor.', 'err')
      }
    }
  }

  const toggleEye = () => {
    const input = document.getElementById('regPwdInput')
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
                  <input type="password" id="regPwdInput" name="regPwd" placeholder="Create a password" required />
                  <button className="eye-btn" onClick={toggleEye} type="button">
                    <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                </div>
              </div>

              <button className="btn-auth" type="submit">
                <div className="btn-sp"></div>
                <span className="btn-txt">{role === 'patient' ? 'Create Account' : 'Register as Doctor'}</span>
                <svg className="btn-arr" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </form>

            <div className="auth-div">or</div>
            <div className="auth-sw">Already have an account? <a onClick={() => navigate('/login')}>Sign in here</a></div>
            <div className="auth-sw" style={{ marginTop: '.5rem' }}><a onClick={() => navigate('/')} style={{ color: 'var(--gray-400)', fontWeight: '600' }}>Back to Home</a></div>
            <BackButton />
          </div>
        </div>
      </div>
    </>
  )
}
