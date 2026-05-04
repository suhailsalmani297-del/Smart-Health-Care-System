import React, { useState, useEffect } from 'react'
import { T } from './Constants'
import { Avatar, SpecBadge, fmtDateShort } from './Shared'

/* ── Inline Prescription Panel ── */
function PrescriptionPanel({ patientEmail }) {
  const [dietPlan, setDietPlan]       = useState(null);
  const [exercisePlan, setExercisePlan] = useState(null);
  const [tab, setTab]                 = useState("diet");
  const [open, setOpen]               = useState(false);

  useEffect(() => {
    const diets    = JSON.parse(localStorage.getItem("shs_diet_plans")     || "[]");
    const exercises= JSON.parse(localStorage.getItem("shs_exercise_plans") || "[]");
    setDietPlan(    diets.find(r => r.patientEmail === patientEmail)     || null);
    setExercisePlan(exercises.find(r => r.patientEmail === patientEmail) || null);
  }, [patientEmail]);

  const hasAny = dietPlan || exercisePlan;
  if (!hasAny) return null;

  const dietLines = dietPlan ? (() => {
    const d = dietPlan.data; const lines = [];
    if (d.dietType)          lines.push({ label: "Diet Type",        val: d.dietType });
    if (d.diseases?.length)  lines.push({ label: "Conditions",       val: d.diseases.join(", ") });
    if (d.breakfast)         lines.push({ label: "🌅 Breakfast",      val: d.breakfast });
    if (d.midMorning)        lines.push({ label: "☕ Mid-Morning",    val: d.midMorning });
    if (d.lunch)             lines.push({ label: "🍛 Lunch",          val: d.lunch });
    if (d.eveningSnack)      lines.push({ label: "🍎 Evening Snack",  val: d.eveningSnack });
    if (d.dinner)            lines.push({ label: "🌙 Dinner",         val: d.dinner });
    if (d.waterIntake)       lines.push({ label: "💧 Water Intake",   val: d.waterIntake });
    if (d.supplements)       lines.push({ label: "💊 Supplements",    val: d.supplements });
    if (d.tips)              lines.push({ label: "📝 Doctor's Advice",val: d.tips });
    return lines;
  })() : [];

  const exLines = exercisePlan ? (() => {
    const ex = exercisePlan.data; const lines = [];
    if (ex.morning)   lines.push({ label: "🌅 Morning Routine",      val: ex.morning });
    if (ex.afternoon) lines.push({ label: "☀️ Afternoon Activity",   val: ex.afternoon });
    if (ex.evening)   lines.push({ label: "🌆 Evening Routine",      val: ex.evening });
    if (ex.duration)  lines.push({ label: "⏱ Duration",              val: ex.duration });
    if (ex.intensity) lines.push({ label: "⚡ Intensity",             val: ex.intensity });
    if (ex.tips)      lines.push({ label: "📝 Safety Tips",           val: ex.tips });
    return lines;
  })() : [];

  const activeLines = tab === "diet" ? dietLines : exLines;
  const activePlan  = tab === "diet" ? dietPlan   : exercisePlan;

  return (
    <div style={{ marginTop: 14 }}>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 16px", borderRadius: 99,
          border: "none", cursor: "pointer",
          background: open
            ? "linear-gradient(135deg,#059669,#2563EB)"
            : "linear-gradient(135deg,#D1FAE5,#DBEAFE)",
          color: open ? "white" : "#064E3B",
          fontSize: 12, fontWeight: 700,
          transition: "all 0.2s",
          boxShadow: open ? "0 4px 12px rgba(37,99,235,0.2)" : "none",
        }}
      >
        <span style={{ fontSize: 15 }}>💊</span>
        {open ? "Hide Doctor's Plan ▲" : "View Doctor's Plan ▼"}
        {/* badges */}
        {dietPlan && (
          <span style={{
            background:"#059669", color:"white",
            fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:99,
            marginLeft:4
          }}>Diet</span>
        )}
        {exercisePlan && (
          <span style={{
            background:"#2563EB", color:"white",
            fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:99,
            marginLeft:2
          }}>Exercise</span>
        )}
      </button>

      {open && (
        <div style={{
          marginTop: 12,
          background: "white",
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: T.sh2,
        }}>
          {/* Tab bar */}
          <div style={{
            display: "flex",
            background: "#F8FAFC",
            borderBottom: `1px solid ${T.border}`,
          }}>
            {[
              { key: "diet",     label: "🥗 Diet Plan",     has: !!dietPlan },
              { key: "exercise", label: "🏃 Exercise Plan", has: !!exercisePlan },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                disabled={!t.has}
                style={{
                  flex: 1, padding: "11px 16px", border: "none",
                  background: tab === t.key && t.has
                    ? (t.key === "diet" ? "#D1FAE5" : "#DBEAFE")
                    : "transparent",
                  color: !t.has
                    ? T.muted
                    : tab === t.key
                      ? (t.key === "diet" ? "#064E3B" : "#1E3A8A")
                      : T.textMd,
                  fontWeight: 700, fontSize: 12.5, cursor: t.has ? "pointer" : "not-allowed",
                  borderBottom: tab === t.key && t.has
                    ? `2px solid ${t.key === "diet" ? "#059669" : "#2563EB"}`
                    : "2px solid transparent",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {t.label} {!t.has && <span style={{ fontSize:10 }}>(Not set)</span>}
              </button>
            ))}
          </div>

          {/* Plan Content */}
          {activePlan ? (
            <div style={{ padding: "20px 24px" }}>
              {/* Doctor & Date meta */}
              <div style={{
                display:"flex", alignItems:"center", gap:10,
                marginBottom:16, padding:"10px 14px",
                background: tab==="diet" ? "#F0FFF4" : "#EFF6FF",
                borderRadius:10,
                border:`1px solid ${tab==="diet" ? "#BBF7D0" : "#BFDBFE"}`,
              }}>
                <span style={{ fontSize:20 }}>{tab==="diet" ? "🥗" : "🏃"}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color: tab==="diet" ? "#064E3B" : "#1E3A8A" }}>
                    Prescribed by Dr. {activePlan.doctorName}
                  </div>
                  <div style={{ fontSize:11, color:T.muted }}>
                    📅 {new Date(activePlan.date).toLocaleDateString("en-IN", {
                      day:"numeric", month:"long", year:"numeric"
                    })}
                  </div>
                </div>
              </div>

              {/* Plan rows */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {activeLines.map((row, i) => (
                  <div key={i} style={{
                    display:"flex", gap:12, alignItems:"flex-start",
                    padding:"10px 14px",
                    background: i % 2 === 0 ? "#F8FAFC" : "white",
                    borderRadius:10,
                    border:`1px solid ${T.border}`,
                  }}>
                    <div style={{
                      minWidth:130, fontSize:12, fontWeight:700, color:T.muted,
                      textTransform:"uppercase", letterSpacing:"0.4px", paddingTop:1,
                    }}>
                      {row.label}
                    </div>
                    <div style={{
                      flex:1, fontSize:13.5, color:T.textMd,
                      lineHeight:1.6, whiteSpace:"pre-line",
                    }}>
                      {row.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding:"30px", textAlign:"center", color:T.muted, fontSize:13 }}>
              No {tab} plan assigned yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */
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

      {/* Stats */}
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

      {/* Filter Tabs */}
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

      {/* Appointment Cards */}
      {shown.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <div style={{ fontSize:56, marginBottom:18 }}>{appointments.length===0 ? "📋" : "🔍"}</div>
          <div style={{ fontSize:17, fontWeight:700, color:T.text, marginBottom:6 }}>
            {appointments.length===0 ? "No appointments yet" : "No appointments in this category"}
          </div>
          <div style={{ fontSize:13, color:T.muted }}>
            {appointments.length===0 ? "Go to Find Doctors to book your first appointment." : "Try a different filter."}
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {shown.map(appt => {
            const sc = statusColors[appt.status] || statusColors.upcoming;
            return (
              <div key={appt.id} style={{
                background: T.surface, borderRadius:18, padding:"20px 22px",
                boxShadow: T.sh1, border:`1px solid ${T.border}`,
              }}>
                {/* Top Row */}
                <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
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
                      onClick={() => { setSelectedDoctor(appt.doctor); setPage("chat"); }}
                      style={{
                        marginTop:5, padding:"6px 12px", background:T.blueLt, color:T.blue,
                        border:"none", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer"
                      }}
                    >
                      💬 Message
                    </button>
                  </div>
                </div>

                {/* Doctor's Plan Panel — shown below appointment info */}
                <PrescriptionPanel patientEmail={appt.email} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
