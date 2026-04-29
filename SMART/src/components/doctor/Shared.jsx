import React from 'react'

export function Avatar({ initials, color, size = 48, img }) {
  if (img) {
    return (
      <img src={img} alt="Avatar" style={{
        width: size, height: size, borderRadius: "50%",
        border: `2px solid ${color}44`, objectFit: "cover", flexShrink: 0
      }} />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}22, ${color}44)`,
      border: `2px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Bricolage Grotesque',sans-serif",
      fontWeight: 700, fontSize: size * 0.35, color,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export function StatCard({ label, value, sub, icon, color, delay }) {
  return (
    <div className={`card card-lift fade-up fade-up-${delay}`} style={{ padding:"22px 24px", background: 'white', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:13, color:"#64748b", fontWeight:500, marginBottom:8 }}>{label}</div>
          <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:30, fontWeight:700, color:"#1e293b", lineHeight:1 }}>{value}</div>
          {sub && <div style={{ fontSize:12, color:"#94a3b8", marginTop:6 }}>{sub}</div>}
        </div>
        <div style={{
          width:44, height:44, borderRadius:14,
          background:`linear-gradient(135deg, ${color}18, ${color}30)`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
        }}>{icon}</div>
      </div>
    </div>
  );
}
