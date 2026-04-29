import React from 'react'

export default function AppointmentsView({ appointments }) {
  return (
    <div className="fade-up">
      <h2 style={{ marginBottom: 20 }}>All Appointments</h2>
      <div className="card" style={{ padding: 24, background: 'white', borderRadius: '20px' }}>
         {appointments.length === 0 ? <p style={{ color: '#94a3b8', textAlign: 'center' }}>No appointments yet.</p> : 
         appointments.map(apt => (
            <div key={apt.id} style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{apt.patientName} ({apt.age}y, {apt.gender})</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Contact: {apt.contact}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Date: {apt.day}, {apt.slot}</div>
              </div>
              <div>
                 <span style={{
                   padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                   background: apt.status === 'confirmed' ? '#dcfce7' : apt.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                   color: apt.status === 'confirmed' ? '#166534' : apt.status === 'cancelled' ? '#991b1b' : '#92400e'
                 }}>
                   {apt.status.toUpperCase()}
                 </span>
              </div>
            </div>
         ))}
      </div>
    </div>
  );
}
