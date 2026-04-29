import React, { useState } from 'react'
import { T, SPEC } from './Constants'
import { Avatar, SpecBadge, Stars, Btn, fmtDate, fmtDateShort } from './Shared'

const StepDot = ({ n, label, step }) => {
  const done = step > n; const active = step === n;
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5, position:"relative" }}>
      {n < 3 && <div style={{ position:"absolute", top:13, left:"50%", width:"100%", height:2, background: done ? T.green : T.border, zIndex:0 }} />}
      <div style={{ width:26, height:26, borderRadius:"50%", zIndex:1, background: done ? T.greenMid : active ? T.blue : T.border, color:"#fff", fontSize:11.5, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {done ? "✓" : n}
      </div>
      <div style={{ fontSize:10.5, color: active ? T.blue : done ? T.green : T.muted, fontWeight: active ? 700 : 400, textAlign:"center" }}>{label}</div>
    </div>
  );
};

function BookingForm({ doctor, user, onSuccess }) {
  const [step, setStep] = useState(1);
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ patientName:"", age:"", gender:"", problem:"", contact:"", email:"" });
  const [errors, setErrors] = useState({});
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const getDate = dayIdx => {
    const today = new Date(); const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const diff = dayIdx - todayIdx; const d = new Date(today);
    d.setDate(today.getDate() + (diff >= 0 ? diff : diff + 7)); return d;
  };

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = "Full name is required";
    if (!form.age || isNaN(+form.age) || +form.age < 1 || +form.age > 120) e.age = "Enter valid age (1–120)";
    if (!form.gender) e.gender = "Please select gender";
    if (!form.problem.trim() || form.problem.length < 10) e.problem = "Describe your problem (min 10 characters)";
    if (!form.contact.trim() || form.contact.replace(/\D/g,"").length < 10) e.contact = "Enter a valid 10-digit phone number";
    return e;
  };

  const handleSubmit = () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return; }
    const appt = { id: Date.now().toString(36), doctor, ...form, day, slot, date: getDate(DAYS.indexOf(day)), status: "pending", bookedAt: new Date() };
    onSuccess(appt);
    
    // Notifications
    const notifs = JSON.parse(localStorage.getItem('shs_notifications') || '[]');
    notifs.push({ id: Date.now(), to: doctor.email, msg: `New appointment request from ${form.patientName}.`, time: new Date().toISOString(), type: 'appointment' });
    if (user) {
        notifs.push({ id: Date.now() + 1, to: user.email, msg: `You have sent an appointment request to Dr. ${doctor.name.split(" ")[1]}.`, time: new Date().toISOString(), type: 'appointment' });
    }
    localStorage.setItem('shs_notifications', JSON.stringify(notifs));
  };

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  return (
    <div>
      <div style={{ display:"flex", gap:0, marginBottom:26 }}>
        <StepDot n={1} label="Choose Day" step={step} />
        <StepDot n={2} label="Pick Time" step={step} />
        <StepDot n={3} label="Your Details" step={step} />
      </div>

      {step === 1 && (
        <div>
          <div style={{ fontSize:13.5, fontWeight:600, color:T.text, marginBottom:14 }}>Select an Available Day</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:7, marginBottom:22 }}>
            {DAYS.map((d,i) => {
              const av = doctor.avail[d]; const sel = day === d; const dt = getDate(i);
              return (
                <button key={d} onClick={() => av && setDay(d)} disabled={!av} style={{
                  padding:"10px 3px", borderRadius:10, border:`1.5px solid ${sel ? T.blue : av ? T.border : T.border}`,
                  background: sel ? T.blue : av ? T.surface : T.bg, color: sel ? "#fff" : av ? T.text : T.subtle,
                  cursor: av ? "pointer" : "not-allowed", textAlign:"center", transition:"all .15s", opacity: av ? 1 : 0.45, fontFamily:"inherit",
                }}>
                  <div style={{ fontSize:11, fontWeight:700, marginBottom:3 }}>{d}</div>
                  <div style={{ fontSize:9.5, opacity:.8 }}>{dt.getDate()}/{dt.getMonth()+1}</div>
                  <div style={{ fontSize:9, marginTop:4, color: sel?"#fff": av ? T.greenMid : T.red }}>{av ? "●" : "×"}</div>
                </button>
              );
            })}
          </div>
          <Btn full onClick={() => day && setStep(2)} disabled={!day} size="lg">Continue to Time →</Btn>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <button onClick={() => setStep(1)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:T.muted, lineHeight:1 }}>←</button>
            <div style={{ fontSize:13.5, fontWeight:600, color:T.text }}>Available Slots — <span style={{ color:T.blue }}>{day}</span></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:22 }}>
            {doctor.slots.map(s => {
              const sel = slot === s;
              return (
                <button key={s} onClick={() => setSlot(s)} style={{
                  padding:"12px 6px", borderRadius:10, border:`1.5px solid ${sel ? T.blue : T.border}`,
                  background: sel ? T.blue : T.surface, color: sel ? "#fff" : T.text,
                  cursor:"pointer", fontSize:13, fontWeight: sel ? 600 : 400, transition:"all .15s", fontFamily:"inherit",
                }}>
                  🕐 {s}
                </button>
              );
            })}
          </div>
          <Btn full onClick={() => slot && setStep(3)} disabled={!slot} size="lg">Continue →</Btn>
        </div>
      )}

      {step === 3 && (
        <div>
          <FG label="Full Name" id="patientName" required errors={errors}><input value={form.patientName} onChange={e => set("patientName", e.target.value)} placeholder="e.g. John Doe" style={inpStyle(errors.patientName)} /></FG>
          <FG label="Age" id="age" required errors={errors}><input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="e.g. 30" style={inpStyle(errors.age)} /></FG>
          <FG label="Gender" id="gender" required errors={errors}>
            <div style={{ display:"flex", gap:8 }}>
              {["Male","Female","Other"].map(g => (
                <button key={g} type="button" onClick={() => set("gender",g)} style={{ flex:1, padding:"9px", borderRadius:9, border:`1.5px solid ${form.gender===g ? T.blue : T.border}`, background: form.gender===g ? T.blueLt : T.surface, color: form.gender===g ? T.blue : T.muted, cursor:"pointer", fontSize:13, fontWeight: form.gender===g ? 600 : 400, transition:"all .15s", fontFamily:"inherit" }}>{g}</button>
              ))}
            </div>
          </FG>
          <FG label="Phone" id="contact" required errors={errors}><input value={form.contact} onChange={e => set("contact", e.target.value)} placeholder="+91 98765..." style={inpStyle(errors.contact)} /></FG>
          <FG label="Problem" id="problem" required errors={errors}><textarea value={form.problem} onChange={e => set("problem", e.target.value)} placeholder="Describe symptoms..." rows={3} style={{...inpStyle(errors.problem), resize:'vertical'}} /></FG>
          <Btn full variant="green" onClick={handleSubmit} size="lg">✅ Confirm Appointment</Btn>
        </div>
      )}
    </div>
  );
}

const inpStyle = (err) => ({ width:"100%", padding:"10px 13px", borderRadius:9, border:`1.5px solid ${err ? T.red : T.border}`, fontSize:13.5, color:T.text, background: err?"#FFF5F5":T.surface, outline:"none", boxSizing:"border-box", fontFamily:"inherit" });
const FG = ({ label, id, required, children, errors }) => (
  <div style={{ marginBottom: 15 }}>
    <label style={{ fontSize:12.5, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>{label}{required && <span style={{ color:T.red }}> *</span>}</label>
    {children}{errors[id] && <div style={{ fontSize:11.5, color:T.red, marginTop:4 }}>⚠ {errors[id]}</div>}
  </div>
);

function ConfirmationScreen({ appointment: appt, onDone, onNew }) {
  return (
    <div style={{ maxWidth: 580, margin: "0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:30 }}>
        <div style={{ width:76, height:76, borderRadius:"50%", background:`linear-gradient(135deg,${T.greenMid},#34D399)`, margin:"0 auto 18px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, color:"#fff", boxShadow:`0 10px 28px ${T.green}50` }}>✓</div>
        <h2 style={{ fontSize:23, fontWeight:800, color:T.text, margin:"0 0 8px" }}>Request Sent!</h2>
        <p style={{ fontSize:13.5, color:T.muted }}>Your appointment request has been sent to the doctor.</p>
      </div>
      <div style={{ background:T.surface, borderRadius:20, padding:26, boxShadow:T.sh3, border:`1px solid ${T.border}`, marginBottom:20 }}>
        <div style={{ display:"flex", gap:14, alignItems:"center", paddingBottom:16, borderBottom:`1px solid ${T.border}`, marginBottom:18 }}>
          <Avatar name={appt.doctor.name} size={54} spec={appt.doctor.spec} img={appt.doctor.image} />
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:16, color:T.text, marginBottom:4 }}>{appt.doctor.name}</div>
            <SpecBadge spec={appt.doctor.spec} />
          </div>
          <div style={{ background:T.amberLt, color:T.amber, padding:"6px 14px", borderRadius:99, fontSize:12, fontWeight:700 }}>⏳ Pending</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          {[['📅','Date',fmtDate(appt.date)], ['🕐','Time',appt.slot], ['👤','Patient',appt.patientName], ['💰','Fee',`₹${appt.doctor.fee}`]].map(([icon,label,val]) => (
            <div key={label} style={{ background:T.bg, borderRadius:10, padding:"10px 13px" }}>
              <div style={{ fontSize:11, color:T.subtle, marginBottom:2 }}>{icon} {label}</div>
              <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
        <Btn variant="green" size="lg" onClick={onDone}>📋 View History</Btn>
        <Btn size="lg" onClick={onNew}>＋ New Booking</Btn>
      </div>
    </div>
  );
}

export default function DoctorDetails({ doctor, user, setPage, addAppointment }) {
  const [booked, setBooked] = useState(null);
  if (!doctor) return null;
  const s = SPEC[doctor.spec] || { bg: T.blueLt, fg: T.blue };
  const onSuccess = appt => { addAppointment(appt); setBooked(appt); };
  if (booked) return <ConfirmationScreen appointment={booked} onDone={() => setPage("history")} onNew={() => setPage("list")} />;

  return (
    <div>
      <button onClick={() => setPage("list")} style={{ background:"none", border:"none", cursor:"pointer", color:T.blue, fontSize:13.5, fontWeight:600, padding:"0 0 22px", display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>← Back</button>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.15fr", gap:22, alignItems:"start" }}>
        <div>
          <div style={{ background:T.surface, borderRadius:20, padding:26, boxShadow:T.sh2, border:`1px solid ${T.border}` }}>
            <div style={{ background: s.grad || `linear-gradient(135deg,${s.fg}20,${s.fg}08)`, borderRadius:14, padding:"18px 20px", marginBottom:18, display:"flex", gap:16, alignItems:"flex-start" }}>
              <Avatar name={doctor.name} size={68} spec={doctor.spec} img={doctor.image} />
              <div style={{ flex:1 }}>
                <h2 style={{ margin:"0 0 6px", fontSize:19, fontWeight:800, color:T.text }}>{doctor.name}</h2>
                <SpecBadge spec={doctor.spec} size="md" />
                <div style={{ fontSize:12, color:T.muted, marginTop:8 }}>🏥 {doctor.hospital}, {doctor.city}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
              <Stars rating={doctor.rating} size={16} />
              <span style={{ fontSize:15, fontWeight:800, color:T.text }}>{doctor.rating}</span>
            </div>
            <p style={{ fontSize:13, color:T.muted, lineHeight:1.75 }}>{doctor.desc}</p>
          </div>
        </div>
        <div style={{ background:T.surface, borderRadius:20, padding:26, boxShadow:T.sh2, border:`1px solid ${T.border}`, position:"sticky", top:20 }}>
          <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:22 }}>📋 Book Appointment</div>
          <BookingForm doctor={doctor} user={user} onSuccess={onSuccess} />
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
            <Btn full variant="outline" onClick={() => setPage("chat")}>💬 Message Dr. {doctor.name.split(" ").pop()}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
