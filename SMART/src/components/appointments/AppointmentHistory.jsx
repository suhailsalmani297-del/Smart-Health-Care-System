import React, { useState } from 'react'
import { T } from './Constants'
import { Avatar, SpecBadge, fmtDateShort } from './Shared'

export default function AppointmentHistory({ appointments, setPage, setSelectedDoctor }) {
  const [filter, setFilter] = useState("all");

  const stats = {
    total:     appointments.length,
    upcoming:  appointments.filter(a => a.status === "upcoming").length,
    completed: appointments.filter(a => a.status === "completed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
  };
  const shown = filter === "all" ? appointments : appointments.filter(a => a.status === filter);
  const statusColors = {
    upcoming:  { bg: T.blueLt,  fg: T.blue },
    completed: { bg: T.greenLt, fg: T.green },
    cancelled: { bg: T.redLt,   fg: T.red },
    pending:   { bg: T.amberLt, fg: T.amber },
  };

  return (
    <div className="fade-up">
      <h1 style={{ fontSize:22, fontWeight:800, color:T.text, margin:"0 0 22px" }}>My Appointments</h1>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:14, marginBottom:28 }}>
        {[
          { label:"Total Booked",   val:stats.total,     icon:"📊", bg:T.blueLt,   fg:T.blue },
          { label:"Upcoming",       val:stats.upcoming,  icon:"🗓️", bg:"#FFFBEB",  fg:"#C27803" },
          { label:"Completed",      val:stats.completed, icon:"✅", bg:T.greenLt,  fg:T.green },
          { label:"Cancelled",      val:stats.cancelled, icon:"❌", bg:T.redLt,    fg:T.red },
        ].map(({ label, val, icon, bg, fg }) => (
          <div key={label} style={{ background:T.surface, borderRadius:16, padding:"18px", boxShadow:T.sh1, border:`1px solid ${T.border}` }}>
            <div style={{ width:38, height:38, borderRadius:11, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, marginBottom:12 }}>{icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:fg, lineHeight:1 }}>{val}</div>
            <div style={{ fontSize:12, color:T.muted, marginTop:5 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:22, background:T.surface, borderRadius:12, padding:"4px", border:`1px solid ${T.border}`, width:"fit-content" }}>
        {["all","upcoming","completed","cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"7px 16px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12.5,
            background: filter===f ? T.blue : "transparent",
            color: filter===f ? "#fff" : T.muted, fontWeight: filter===f ? 600 : 400,
            transition:"all .15s", fontFamily:"inherit",
          }}>
            {f.charAt(0).toUpperCase()+f.slice(1)} ({f==="all" ? stats.total : stats[f]||0})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <div style={{ fontSize:56, marginBottom:18 }}>{appointments.length===0 ? "📋" : "🔍"}</div>
          <div style={{ fontSize:17, fontWeight:700, color:T.text, marginBottom:6 }}>
            {appointments.length===0 ? "No appointments yet" : "No appointments in this category"}
          </div>
          <div style={{ fontSize:13, color:T.muted }}>{appointments.length===0 ? "Go to Find Doctors to book your first appointment." : "Try a different filter."}</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {shown.map(appt => {
            const sc = statusColors[appt.status] || statusColors.upcoming;
            return (
              <div key={appt.id} style={{ background:T.surface, borderRadius:15, padding:"18px 20px", boxShadow:T.sh1, border:`1px solid ${T.border}`, display:"flex", gap:16, alignItems:"flex-start" }}>
                <Avatar name={appt.doctor.name} size={50} spec={appt.doctor.spec} img={appt.doctor.image} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:700, fontSize:14.5, color:T.text }}>{appt.doctor.name}</span>
                    <SpecBadge spec={appt.doctor.spec} />
                  </div>
                  <div style={{ fontSize:12.5, color:T.muted, display:"flex", gap:16, flexWrap:"wrap", marginBottom:6 }}>
                    <span>📅 {fmtDateShort(appt.date)}</span>
                    <span>🕐 {appt.slot}</span>
                    <span>🏥 {appt.doctor.hospital}</span>
                    <span>👤 {appt.patientName}</span>
                  </div>
                  {appt.problem && (
                    <div style={{ fontSize:12, color:T.textMd, background:T.bg, borderRadius:7, padding:"5px 10px", display:"inline-block", maxWidth:"100%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      🩺 {appt.problem.length>70 ? appt.problem.slice(0,70)+"…" : appt.problem}
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
                  <span style={{ background:sc.bg, color:sc.fg, padding:"4px 12px", borderRadius:99, fontSize:11.5, fontWeight:700 }}>
                    {appt.status.charAt(0).toUpperCase()+appt.status.slice(1)}
                  </span>
                  <span style={{ fontSize:13, fontWeight:700, color:T.green }}>₹{appt.doctor.fee}</span>
                  <button 
                    onClick={() => {
                      setSelectedDoctor(appt.doctor);
                      setPage("chat");
                    }}
                    style={{ 
                      marginTop: 5, padding: "6px 12px", background: T.blueLt, color: T.blue, 
                      border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer" 
                    }}
                  >
                    💬 Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
