import React, { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../components/doctor/Shared'
import DashboardView from '../components/doctor/DashboardView'
import AppointmentsView from '../components/doctor/AppointmentsView'
import RecommendationsView from '../components/doctor/RecommendationsView'
import MessagesView from '../components/doctor/MessagesView'
import NotificationsView from '../components/doctor/NotificationsView'
import ProfileView from '../components/doctor/ProfileView'

export default function DoctorPortal() {
  const { doctor, logout, addToast, updateDoctor, saveRecommendation } = useAuth()
  const navigate = useNavigate()
  const [view, setView] = useState("dashboard")
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    if (!doctor) {
      navigate('/doctor-login')
      return
    }
    const saved = JSON.parse(localStorage.getItem('appointments') || '[]')
    const docAppts = saved.filter(a => a.doctor.name === doctor.name)
    setAppointments(docAppts)
  }, [doctor, navigate])

  const handleStatus = (id, status) => {
    const allAppts = JSON.parse(localStorage.getItem('appointments') || '[]')
    const updated = allAppts.map(a => a.id === id ? { ...a, status } : a)
    localStorage.setItem('appointments', JSON.stringify(updated))
    const currentApt = updated.find(a => a.id === id)
    setAppointments(updated.filter(a => a.doctor.name === doctor.name))
    addToast(`Appointment ${status} successfully!`, 'ok')

    const notifs = JSON.parse(localStorage.getItem('shs_notifications') || '[]');
    notifs.push({
      id: Date.now(),
      to: currentApt.email,
      msg: `Your appointment with Dr. ${doctor.name} has been ${status}.`,
      time: new Date().toISOString(),
      type: 'appointment'
    });
    localStorage.setItem('shs_notifications', JSON.stringify(notifs));
  }

  if (!doctor) return null

  const renderContent = () => {
    switch(view) {
      case "dashboard":       return <DashboardView doctor={doctor} appointments={appointments} handleStatus={handleStatus} />;
      case "appointments":    return <AppointmentsView appointments={appointments} />;
      case "recommendations": return <RecommendationsView doctor={doctor} addToast={addToast} saveRecommendation={saveRecommendation} />;
      case "messages":        return <MessagesView doctor={doctor} addToast={addToast} />;
      case "notifications":   return <NotificationsView doctor={doctor} />;
      case "profile":         return <ProfileView doctor={doctor} updateDoctor={updateDoctor} addToast={addToast} />;
      default:                return <div>Coming Soon</div>
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: 'white', borderRight: '1px solid #e2e8f0', padding: 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #0ea5e9, #10b981)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>+</div>
          <span style={{ fontWeight: 'bold', color: '#0369a1' }}>Doctor Portal</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'recommendations', label: 'Recommendations' },
            { id: 'messages', label: 'Messages' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'profile', label: 'Profile Settings' },
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} style={{ padding: '12px 16px', border: 'none', background: view === item.id ? '#f0f9ff' : 'transparent', color: view === item.id ? '#0ea5e9' : '#64748b', borderRadius: 12, textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}>{item.label}</button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
           <div style={{ marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar initials={doctor.name?.charAt(0)} color="#0ea5e9" size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{doctor.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{doctor.spec}</div>
              </div>
           </div>
           <button onClick={() => { logout(); navigate('/'); }} style={{ width: '100%', padding: '10px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {renderContent()}
      </main>

      <style>{`
        .fade-up { animation: fadeUp 0.5s ease-out; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-lift:hover { transform: translateY(-5px); transition: 0.3s; }
        .card { background: white; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      `}</style>
    </div>
  )
}
