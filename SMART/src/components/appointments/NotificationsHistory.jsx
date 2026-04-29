import React, { useState, useEffect } from 'react'
import { T } from './Constants'

export default function NotificationsHistory({ user }) {
  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('shs_notifications') || '[]');
    setNotifs(all.filter(n => n.to === user.email).reverse());
  }, [user]);

  return (
    <div className="fade-up">
      <h1 style={{ fontSize:22, fontWeight:800, color:T.text, margin:"0 0 22px" }}>Notifications</h1>
      <div style={{ background:T.surface, borderRadius:20, padding:26, boxShadow:T.sh2, border:`1px solid ${T.border}` }}>
        {notifs.length === 0 ? <p style={{ textAlign:'center', color:T.muted }}>No new notifications.</p> : (
          notifs.map(n => (
            <div key={n.id} style={{ padding:'16px 0', borderBottom:`1px solid ${T.border}`, display:'flex', gap:12 }}>
              <div style={{ fontSize:20 }}>{n.type === 'appointment' ? '📅' : '💬'}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:T.text }}>{n.msg}</div>
                <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>{new Date(n.time).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
