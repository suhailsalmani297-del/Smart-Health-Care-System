import React from 'react'
import { StatCard, Avatar } from './Shared'
import { COLORS } from './Constants'

export default function DashboardView({ doctor, appointments, handleStatus }) {
  return (
    <div className="fade-up">
      <div style={{
        background:"linear-gradient(135deg, #0ea5e9 0%, #0369a1 50%, #0c4a6e 100%)",
        borderRadius:24, padding:"28px 32px", marginBottom:28, color: 'white'
      }}>
        <div style={{ fontSize:13, opacity:0.8, marginBottom:4 }}>Good morning 👋</div>
        <h2 style={{ fontSize:24, fontWeight:700, marginBottom:6 }}>{doctor.name}</h2>
        <div style={{ fontSize:14, opacity:0.75 }}>{doctor.spec} · SmartCare Hospital</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16, marginBottom:28 }}>
        <StatCard label="Total Requests" value={appointments.length} sub="Lifetime" icon="📅" color="#0ea5e9" delay={1} />
        <StatCard label="Pending" value={appointments.filter(a => a.status === 'upcoming' || a.status === 'pending').length} sub="Needs action" icon="⏳" color="#f59e0b" delay={2} />
        <StatCard label="Confirmed" value={appointments.filter(a => a.status === 'confirmed').length} sub="Scheduled" icon="✅" color="#10b981" delay={3} />
      </div>

      <div className="card" style={{ padding: 24, background: 'white', borderRadius: '20px' }}>
        <h3 style={{ marginBottom: 20 }}>Recent Appointment Requests</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {appointments.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No appointments yet.</p>
          ) : (
            appointments.map(apt => (
              <div key={apt.id} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0'
              }}>
                <Avatar initials={apt.patientName?.charAt(0)} color="#0ea5e9" size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{apt.patientName}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{apt.problem}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{apt.day} at {apt.slot}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {apt.status === 'confirmed' ? (
                    <span style={{ color: '#10b981', fontWeight: 600, fontSize: 13 }}>Confirmed</span>
                  ) : apt.status === 'cancelled' ? (
                    <span style={{ color: '#ef4444', fontWeight: 600, fontSize: 13 }}>Cancelled</span>
                  ) : (
                    <>
                      <button onClick={() => handleStatus(apt.id, 'confirmed')} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Accept</button>
                      <button onClick={() => handleStatus(apt.id, 'cancelled')} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
