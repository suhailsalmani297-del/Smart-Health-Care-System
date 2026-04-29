import { useState, createContext, useContext } from "react";
import { T } from "../components/appointments/Constants";
import DoctorList from "../components/appointments/DoctorList";
import DoctorDetails from "../components/appointments/DoctorDetails";
import AppointmentHistory from "../components/appointments/AppointmentHistory";
import MessagingView from "../components/appointments/MessagingView";
import NotificationsHistory from "../components/appointments/NotificationsHistory";

const Ctx = createContext();
const useApp = () => useContext(Ctx);

function NavTabs({ active, onTabChange }) {
  const tabs = [
    { id: "list", label: "Find Doctors", icon: "🔍" },
    { id: "history", label: "My Appointments", icon: "📅" },
    { id: "chat", label: "Messages", icon: "💬" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 24, padding: '4px', background: 'rgba(26, 86, 219, 0.05)', borderRadius: 16 }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onTabChange(t.id)}
          style={{
            flex: 1, padding: '14px 10px', borderRadius: 12, border: 'none',
            background: active === t.id ? '#fff' : 'transparent',
            boxShadow: active === t.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
            fontWeight: 700, fontSize: 13,
            color: active === t.id ? T.blue : T.muted,
            cursor: 'pointer', transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
        >
          <span style={{ fontSize: 16 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function Appointments({ user, addToast }) {
  const [page, setPage] = useState("list");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState(() => {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
  });

  const addAppointment = (appt) => {
    const updated = [appt, ...appointments];
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    addToast("Appointment booked successfully!", "ok");
  };

  const ctx = { page, setPage, selectedDoctor, setSelectedDoctor, appointments, addAppointment };

  return (
    <Ctx.Provider value={ctx}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
      `}</style>
      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: T.bg, minHeight: "100vh", padding: "20px" }}>
        <NavTabs active={page} onTabChange={(p) => { setPage(p); if(p !== "chat") setSelectedDoctor(null); }} />
        
        {page === "list"    && <DoctorList setPage={setPage} setSelectedDoctor={setSelectedDoctor} />}
        {page === "details" && <DoctorDetails doctor={selectedDoctor} user={user} setPage={setPage} addAppointment={addAppointment} />}
        {page === "history" && <AppointmentHistory appointments={appointments} setPage={setPage} setSelectedDoctor={setSelectedDoctor} />}
        {page === "notifications" && <NotificationsHistory user={user} />}
        {page === "chat" && <MessagingView user={user} addToast={addToast} externalSelectedDoc={selectedDoctor} />}
      </div>
    </Ctx.Provider>
  );
}
