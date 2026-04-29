import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ContactDoctor from './OverviewComponents/ContactDoctor';
import LogVitals from './OverviewComponents/LogVitals';
import ViewRecord from './OverviewComponents/ViewRecord';
import './Overview.css';

export default function Overview({ user }) {
  const navigate = useNavigate()
  const [showAppointment, setShowAppointment] = useState(false)
  const [showContactDoctor, setShowContactDoctor] = useState(false)
  const [showLogVitals, setShowLogVitals] = useState(false)
  const [showViewRecord, setShowViewRecord] = useState(false)
  const [healthData, setHealthData] = useState({
    heartRate: 78,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    bloodOxygen: 98,
    bloodGlucose: 95
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState([])

  useEffect(() => {
    const loadAppointments = () => {
      const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const upcoming = savedAppointments.filter(apt => new Date(apt.date) >= new Date()).slice(0, 3);
      setUpcomingAppointments(upcoming);
    };
    loadAppointments();
  }, []);

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const handleBookAppointment = () => setShowAppointment(true)
  const handleViewRecords = () => setShowViewRecord(true)
  const handleMessageDoctor = () => setShowContactDoctor(true)
  const handleLogVitals = () => setShowLogVitals(true)

  const closeModals = () => {
    setShowAppointment(false)
    setShowContactDoctor(false)
    setShowLogVitals(false)
    setShowViewRecord(false)
    const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const upcoming = savedAppointments.filter(apt => new Date(apt.date) >= new Date()).slice(0, 3);
    setUpcomingAppointments(upcoming);
  }

  const updateVitals = (newVitals) => setHealthData(prev => ({ ...prev, ...newVitals }))

  const getInitials = (name) => {
    if (!name) return 'DR';
    return name.split(' ').map(n => n[0]).join('');
  }

  const formatAppointmentDate = (date) => {
    if (!date) return 'Date TBD';
    const aptDate = new Date(date);
    const today = new Date();
    if (aptDate.toDateString() === today.toDateString()) return 'Today';
    return aptDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  return (
    <div className="dp-overview">
      <div className="dp-header">
        <div>
          <div className="dp-greeting">{greeting()}, <span>{user?.name?.split(' ')[0] || 'User'}</span> 👋</div>
          <div className="dp-subtext">Here's your health summary for today</div>
        </div>
        <div className="dp-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      <div className="dp-kpi-grid">
        {[
          { label: 'Heart Rate', value: healthData.heartRate, unit: 'bpm', status: healthData.heartRate < 60 ? 'Low' : healthData.heartRate > 100 ? 'High' : 'Normal', color: '#ef4444', bg: '#fee2e2', icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> },
          { label: 'Blood Pressure', value: healthData.bloodPressureSystolic, unit: `/${healthData.bloodPressureDiastolic}`, status: healthData.bloodPressureSystolic < 90 || healthData.bloodPressureDiastolic < 60 ? 'Low' : healthData.bloodPressureSystolic > 130 || healthData.bloodPressureDiastolic > 80 ? 'High' : 'Optimal', color: '#3b82f6', bg: '#eff6ff', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
          { label: 'Blood Oxygen', value: healthData.bloodOxygen, unit: '%', status: healthData.bloodOxygen >= 95 ? 'Excellent' : 'Low', color: '#16a34a', bg: '#dcfce7', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
          { label: 'Next Appointment', value: upcomingAppointments[0]?.time?.split(',')[0] || 'No', unit: '', status: upcomingAppointments[0]?.time || 'Appointment', color: '#8b5cf6', bg: '#f5f3ff', icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
        ].map((k, i) => (
          <div className="dp-kpi" key={i}>
            <div className="dp-kpi-icon" style={{ background: k.bg }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={k.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{k.icon}</svg>
            </div>
            <div>
              <div className="dp-kpi-label">{k.label}</div>
              <div className="dp-kpi-value">{k.value}<span className="dp-kpi-unit">{k.unit}</span></div>
              <div className="dp-kpi-status" style={{ color: k.status === 'Normal' || k.status === 'Optimal' || k.status === 'Excellent' ? '#16a34a' : k.status === 'High' || k.status === 'Low' ? '#ef4444' : '#f59e0b' }}>{k.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="qa-centered">
        <div className="dp-qa-grid">
          {[
            { label: 'View Records', action: handleViewRecords, color: '#16a34a', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></> },
            { label: 'Message Doctor', action: handleMessageDoctor, color: '#8b5cf6', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /> },
            { label: 'Log Vitals', action: handleLogVitals, color: '#f59e0b', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
          ].map((qa, i) => (
            <button className="dp-qa" key={i} onClick={qa.action}>
              <div className="dp-qa-icon" style={{ background: qa.color + '18' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={qa.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{qa.icon}</svg>
              </div>
              <span>{qa.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dp-box full-width clickable-card" onClick={() => navigate('/dashboard/appointments')}>
        <div className="dp-box-head">
          <span className="dp-box-title">Upcoming Appointments</span>
          <button className="dp-box-link">View all</button>
        </div>
        <div className="dp-box-body">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((apt, i) => (
              <div className="dp-appt" key={i}>
                <div className="dp-appt-av">{getInitials(apt.doctor?.name || apt.doctor)}</div>
                <div className="dp-appt-info">
                  <div className="dp-appt-name">{apt.doctor?.name || apt.doctor}</div>
                  <div className="dp-appt-spec">{apt.doctor?.spec || 'Doctor'}</div>
                </div>
                <div className="dp-appt-meta">
                  <div className="dp-appt-time">{formatAppointmentDate(apt.date)} • {apt.time}</div>
                  <span className="dp-appt-tag ok">Confirmed</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-appointments">
              <p>No upcoming appointments</p>
              <button className="book-now-btn" onClick={handleBookAppointment}>Book your first appointment</button>
            </div>
          )}
        </div>
      </div>

      <div className="bottom-two-cols">
        <div className="dp-box">
          <div className="dp-box-head"><span className="dp-box-title">Health Metrics</span></div>
          <div className="dp-box-body">
            {[
              { label: 'Heart Rate', val: `${healthData.heartRate} bpm`, pct: (healthData.heartRate / 120) * 100, c1: '#ef4444', c2: '#fca5a5' },
              { label: 'Blood Pressure', val: `${healthData.bloodPressureSystolic}/${healthData.bloodPressureDiastolic}`, pct: (healthData.bloodPressureSystolic / 160) * 100, c1: '#3b82f6', c2: '#93c5fd' },
              { label: 'Blood Oxygen', val: `${healthData.bloodOxygen}%`, pct: healthData.bloodOxygen, c1: '#16a34a', c2: '#4ade80' },
              { label: 'Blood Glucose', val: `${healthData.bloodGlucose} mg/dL`, pct: (healthData.bloodGlucose / 200) * 100, c1: '#d97706', c2: '#fbbf24' },
            ].map((m, i) => (
              <div className="dp-metric" key={i}>
                <div className="dp-metric-top"><span className="dp-metric-label">{m.label}</span><span className="dp-metric-val">{m.val}</span></div>
                <div className="dp-metric-bar"><div className="dp-metric-fill" style={{ width: Math.min(m.pct, 100) + '%', background: `linear-gradient(90deg,${m.c1},${m.c2})` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="dp-box">
          <div className="dp-box-head"><span className="dp-box-title">Recent Activity</span></div>
          <div className="dp-box-body">
            {[
              { label: 'Lab results uploaded', sub: 'Blood panel — Today, 8:15 AM', color: '#16a34a' },
              { label: 'Prescription renewed', sub: 'Dr. Williams — Yesterday', color: '#3b82f6' },
              { label: 'Appointment reminder sent', sub: 'Dr. Carter at 2:00 PM today', color: '#f59e0b' },
              { label: 'Wellness report ready', sub: 'Monthly summary — 2 days ago', color: '#8b5cf6' },
            ].map((a, i) => (
              <div className="dp-activity" key={i}>
                <div className="dp-activity-dot" style={{ background: a.color }} />
                <div><div className="dp-activity-name">{a.label}</div><div className="dp-activity-sub">{a.sub}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals unchanged */}
      {showAppointment && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>×</button>
            <Appointment user={user} onClose={closeModals} />
          </div>
        </div>
      )}
      {showContactDoctor && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>×</button>
            <ContactDoctor user={user} onClose={closeModals} />
          </div>
        </div>
      )}
      {showLogVitals && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>×</button>
            <LogVitals user={user} onSave={updateVitals} onClose={closeModals} />
          </div>
        </div>
      )}
      {showViewRecord && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>×</button>
            <ViewRecord user={user} onClose={closeModals} />
          </div>
        </div>
      )}

      <style jsx>{`
        .dp-overview {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }
        .dp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        .dp-greeting {
          font-size: 1.8rem;
          font-weight: 600;
          color: #0f172a;
        }
        .dp-greeting span { color: #3b82f6; }
        .dp-subtext { color: #475569; margin-top: 0.25rem; }
        .dp-date {
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 40px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #1e293b;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .dp-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .dp-kpi {
          background: white;
          border-radius: 24px;
          padding: 1.25rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          box-shadow: 0 4px 6px -2px rgba(0,0,0,0.05);
          /* Light blue border + subtle shadow */
          border: 1px solid #bfdbfe;
          box-shadow: 0 2px 6px rgba(59,130,246,0.08);
        }
        .dp-kpi-icon {
          width: 52px;
          height: 52px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dp-kpi-icon svg { width: 28px; height: 28px; }
        .dp-kpi-label { font-size: 0.85rem; font-weight: 500; color: #64748b; }
        .dp-kpi-value { font-size: 1.8rem; font-weight: 700; color: #0f172a; line-height: 1.2; }
        .dp-kpi-unit { font-size: 0.9rem; font-weight: 500; color: #64748b; margin-left: 2px; }
        .dp-kpi-status { font-size: 0.75rem; font-weight: 600; margin-top: 4px; }

        /* Centered Quick Actions - LARGER BUTTONS with border */
        .qa-centered {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .dp-qa-grid {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .dp-qa {
          background: white;
          border: 1px solid #bfdbfe;
          border-radius: 32px;
          padding: 1.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          font-weight: 700;
          font-size: 1.2rem;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 6px 14px rgba(0,0,0,0.08);
          min-width: 362px;
        }
        .dp-qa:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 24px -8px rgba(0,0,0,0.15);
          border-color: #93c5fd;
        }
        .dp-qa-icon {
          width: 72px;
          height: 72px;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dp-qa-icon svg {
          width: 36px;
          height: 36px;
        }

        /* Full width box for appointments - with border */
        .full-width {
          width: 100%;
          margin-bottom: 2rem;
        }
        .dp-box {
          background: white;
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
          border: 1px solid #bfdbfe;
          box-shadow: 0 2px 6px rgba(59,130,246,0.05);
        }
        .clickable-card {
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .clickable-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59,130,246,0.12);
          border-color: #93c5fd;
        }
        .dp-box-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f1f5f9;
        }
        .dp-box-title { font-weight: 700; font-size: 1.2rem; color: #0f172a; }
        .dp-box-link { background: none; border: none; color: #3b82f6; font-weight: 500; cursor: pointer; font-size: 0.85rem; }
        .dp-appt {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .dp-appt:last-child { border-bottom: none; }
        .dp-appt-av {
          width: 48px;
          height: 48px;
          background: #eef2ff;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #3b82f6;
        }
        .dp-appt-info { flex: 2; }
        .dp-appt-name { font-weight: 600; }
        .dp-appt-spec { font-size: 0.8rem; color: #64748b; }
        .dp-appt-meta { text-align: right; }
        .dp-appt-time { font-size: 0.8rem; color: #475569; }
        .dp-appt-tag { font-size: 0.7rem; background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 20px; display: inline-block; margin-top: 4px; }

        /* Two columns at bottom */
        .bottom-two-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .dp-metric { margin-bottom: 1rem; }
        .dp-metric-top { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; }
        .dp-metric-label { color: #475569; }
        .dp-metric-val { font-weight: 600; }
        .dp-metric-bar { height: 8px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
        .dp-metric-fill { height: 100%; border-radius: 10px; }
        .dp-activity { display: flex; gap: 0.8rem; margin-bottom: 1rem; }
        .dp-activity-dot { width: 10px; height: 10px; border-radius: 10px; margin-top: 5px; }
        .dp-activity-name { font-weight: 500; font-size: 0.9rem; }
        .dp-activity-sub { font-size: 0.75rem; color: #64748b; }

        /* Modals */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        .modal-content {
          background: white;
          border-radius: 28px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.3s ease;
        }
        .modal-content.large { max-width: 900px; }
        .modal-close {
          position: absolute;
          top: 16px; right: 16px;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .no-appointments { text-align: center; padding: 2rem; color: #64748b; }
        .book-now-btn {
          margin-top: 12px;
          padding: 8px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          font-weight: 500;
        }
        @media (max-width: 800px) {
          .bottom-two-cols { grid-template-columns: 1fr; }
          .dp-qa-grid { gap: 1rem; }
          .dp-qa { padding: 1rem 1.5rem; min-width: 140px; font-size: 1rem; }
          .dp-qa-icon { width: 56px; height: 56px; }
          .dp-qa-icon svg { width: 28px; height: 28px; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  )
}