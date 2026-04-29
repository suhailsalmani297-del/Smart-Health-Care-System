import React, { useState, useEffect } from 'react'

export default function NotificationsView({ doctor }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('shs_notifications') || '[]');
    const filtered = all.filter(n => n.to === doctor.email).reverse();
    setNotifications(filtered);
  }, [doctor]);

  return (
    <div className="fade-up">
      <h2 style={{ marginBottom: 20 }}>Notifications</h2>
      <div className="card" style={{ padding: 24, background: 'white', borderRadius: '20px' }}>
        {notifications.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>No notifications yet.</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 12 }}>
              <div style={{ fontSize: 20 }}>{n.type === 'appointment' ? '📅' : '💬'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: '#1e293b' }}>{n.msg}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{new Date(n.time).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
