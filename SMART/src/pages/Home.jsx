import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard/overview')
    } else {
      navigate('/register')
    }
  }

  const handleSignIn = () => {
    navigate('/login')
  }

  return (
    <>
      {/* NAVBAR */}
      <nav id="mainNav">
        <a className="nav-logo" onClick={() => navigate('/')}>
          <div className="nav-logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          Smart Healthcare System
        </a>
        <div className="nav-links" style={{ display: user ? 'none' : 'flex' }}>
          <button className="nav-btn nav-ghost" onClick={handleSignIn}>Sign In</button>
          <button className="nav-btn nav-solid" onClick={handleGetStarted}>Get Started</button>
        </div>
        <div className="nav-user" style={{ display: user ? 'flex' : 'none' }}>
          <div className="nav-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <span className="nav-name">{user?.name}</span>
          <button className="nav-out" onClick={() => navigate('/dashboard/overview')}>Dashboard</button>
        </div>
      </nav>

      <div className="page active">
        <section className="hero">
          <div className="hero-grid"></div>
          <div className="hero-blob hb1"></div>
          <div className="hero-blob hb2"></div>
          <div className="hero-inner">
            <div>
              <div className="hero-badge">
                <div className="badge-dot">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                Trusted by 50,000+ patients nationwide
              </div>
              <h1 className="hero-title">Welcome to<br /><span>Smart Healthcare System</span></h1>
              <p className="hero-desc">Your complete digital health companion. Manage appointments, access medical records, consult top specialists, and monitor your wellness — all in one secure and easy-to-use platform.</p>
              <div className="hero-btns">
                <button className="btn-primary" onClick={handleGetStarted}>Get Started Free</button>
                <button className="btn-secondary" onClick={handleSignIn}>Sign In</button>
                <button className="btn-ghost" onClick={() => navigate('/login')}>Doctor Portal</button>
              </div>
              <div className="hero-stats">
                <div className="stat"><div className="stat-num">50K+</div><div className="stat-lbl">Patients</div></div>
                <div className="stat"><div className="stat-num">1,200+</div><div className="stat-lbl">Doctors</div></div>
                <div className="stat"><div className="stat-num">98%</div><div className="stat-lbl">Satisfaction</div></div>
                <div className="stat"><div className="stat-num">24/7</div><div className="stat-lbl">Support</div></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="vc">
                <div className="vc-head">
                  <div className="vc-icon vci-blue">
                    <svg viewBox="0 0 24 24">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <div><div className="vc-title">Health Monitor</div><div className="vc-sub">Live vitals overview</div></div>
                </div>
                <div className="pulse-row"><div className="pdot"></div><span className="ptxt">All vitals within normal range</span></div>
                <div className="bar-rows">
                  <div><div className="bar-lbl"><span>Heart Rate</span><span>78 bpm</span></div><div className="bar-track"><div className="bar-fill" style={{ '--w': '68%' }}></div></div></div>
                  <div><div className="bar-lbl"><span>Blood Oxygen</span><span>98%</span></div><div className="bar-track"><div className="bar-fill" style={{ '--w': '98%' }}></div></div></div>
                  <div><div className="bar-lbl"><span>Blood Pressure</span><span>120/80</span></div><div className="bar-track"><div className="bar-fill" style={{ '--w': '75%' }}></div></div></div>
                </div>
              </div>
              <div className="vc">
                <div className="vc-head">
                  <div className="vc-icon vci-green">
                    <svg viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div><div className="vc-title">Today's Schedule</div><div className="vc-sub">3 appointments</div></div>
                </div>
                <div className="appt-rows">
                  <div className="ar"><div className="ar-dot" style={{ background: '#16a34a' }}></div><div><div className="ar-name">Dr. Sarah Williams</div><div className="ar-time">09:30 AM — Cardiology</div></div><span className="ar-tag" style={{ background: '#dcfce7', color: '#166534' }}>Done</span></div>
                  <div className="ar"><div className="ar-dot" style={{ background: 'var(--blue-500)' }}></div><div><div className="ar-name">Dr. James Carter</div><div className="ar-time">02:00 PM — Neurology</div></div><span className="ar-tag" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}>Next</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="sec-hd">
            <div className="sec-lbl">Why Choose Us</div>
            <h2 className="sec-title">Everything You Need for Better Health</h2>
            <p className="sec-desc">From booking appointments to accessing lab results — our platform puts your health in your hands.</p>
          </div>
          <div className="feat-grid">
            <div className="fc"><div className="fc-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div><div className="fc-title">Online Appointments</div><p className="fc-desc">Book, reschedule, or cancel appointments with top specialists easily.</p></div>
            <div className="fc"><div className="fc-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg></div><div className="fc-title">Medical Records</div><p className="fc-desc">Access your complete health history, prescriptions, and lab reports securely.</p></div>
            <div className="fc"><div className="fc-icon"><svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div><div className="fc-title">Vitals Monitoring</div><p className="fc-desc">Track key health indicators including blood pressure, glucose, and more.</p></div>
            <div className="fc"><div className="fc-icon"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div><div className="fc-title">Doctor Consultations</div><p className="fc-desc">Connect with certified doctors via secure video calls and chat from home.</p></div>
            <div className="fc"><div className="fc-icon"><svg viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg></div><div className="fc-title">Wellness Programs</div><p className="fc-desc">Personalised diet, fitness, and mental wellness plans curated by experts.</p></div>
            <div className="fc"><div className="fc-icon"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div><div className="fc-title">Data Security</div><p className="fc-desc">Your health data is encrypted and stored with the highest security standards.</p></div>
          </div>
        </section>

        <section className="cta-section">
          <h2 className="cta-title">Your Health, Our Priority</h2>
          <p className="cta-desc">Join thousands of patients who trust Smart Healthcare System for a better, smarter, and healthier life.</p>
          <button className="btn-cta" onClick={handleGetStarted}>Create Free Account</button>
        </section>



        <footer>
          <div className="f-logo">Smart Healthcare System</div>
          <div className="f-copy">© 2025 Smart Healthcare System. All rights reserved.</div>
        </footer>
      </div>
    </>
  )
}
