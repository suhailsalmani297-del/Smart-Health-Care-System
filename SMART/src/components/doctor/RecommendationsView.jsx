import React, { useState, useEffect } from 'react'

export default function RecommendationsView({ doctor, addToast, saveRecommendation }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [type, setType] = useState("diet");
  const [dietForm, setDietForm] = useState({
    breakfast: "", midMorning: "", lunch: "", eveningSnack: "", dinner: "", tips: ""
  });
  const [exerciseForm, setExerciseForm] = useState({
    morning: "", afternoon: "", evening: "", tips: ""
  });

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem('appointments') || '[]');
    const myPatients = apps.filter(a => a.doctor.name === doctor.name).map(a => ({ email: a.email, name: a.patientName }));
    const unique = Array.from(new Set(myPatients.map(p => p.email))).map(email => myPatients.find(p => p.email === email));
    setPatients(unique);
  }, [doctor]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      addToast("Please select a patient first", "error");
      return;
    }
    const data = type === "diet" ? dietForm : exerciseForm;
    saveRecommendation(type, {
      patientEmail: selectedPatient.email,
      doctorEmail: doctor.email,
      doctorName: doctor.name,
      data,
      date: new Date().toISOString()
    });
    addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} plan recommended!`, "ok");
  };

  return (
    <div className="fade-up">
      <h2 style={{ marginBottom: 20 }}>Health Recommendations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div className="card" style={{ background: 'white', padding: 24, borderRadius: 20, maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
          <h4 style={{ marginBottom: 16, color: '#1e293b' }}>Select Patient</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {patients.length === 0 ? <div style={{ fontSize: 13, color: '#94a3b8' }}>No patients found.</div> : 
            patients.map(p => (
              <button key={p.email} onClick={() => setSelectedPatient(p)} style={{
                padding: '12px', borderRadius: 10, border: selectedPatient?.email === p.email ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                background: selectedPatient?.email === p.email ? '#f0f9ff' : 'white', textAlign: 'left', cursor: 'pointer', transition: '0.2s'
              }}>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{p.email}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: 'white', padding: 32, borderRadius: 24 }}>
          {selectedPatient ? (
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 15 }}>
                 <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Recommending for:</div>
                 <div style={{ fontSize: 18, fontWeight: 800, color: '#0ea5e9' }}>{selectedPatient.name}</div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                <button type="button" onClick={() => setType("diet")} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: type === 'diet' ? '#0ea5e9' : '#f1f5f9', color: type === 'diet' ? 'white' : '#64748b', fontWeight: 600, cursor: 'pointer' }}>Diet Plan</button>
                <button type="button" onClick={() => setType("exercise")} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: type === 'exercise' ? '#0ea5e9' : '#f1f5f9', color: type === 'exercise' ? 'white' : '#64748b', fontWeight: 600, cursor: 'pointer' }}>Exercise Plan</button>
              </div>

              {type === "diet" ? (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div><label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>Breakfast</label>
                  <textarea value={dietForm.breakfast} onChange={e => setDietForm({...dietForm, breakfast: e.target.value})} placeholder="e.g. Oats with milk and 1 banana" rows={2} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} /></div>
                  <div><label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>Mid-Morning</label>
                  <textarea value={dietForm.midMorning} onChange={e => setDietForm({...dietForm, midMorning: e.target.value})} placeholder="e.g. Handful of nuts" rows={2} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} /></div>
                  <div><label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>Lunch</label>
                  <textarea value={dietForm.lunch} onChange={e => setDietForm({...dietForm, lunch: e.target.value})} placeholder="e.g. Brown rice and dal" rows={2} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} /></div>
                  <div><label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>Evening Snack</label>
                  <textarea value={dietForm.eveningSnack} onChange={e => setDietForm({...dietForm, eveningSnack: e.target.value})} placeholder="e.g. Green tea and roasted chana" rows={2} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} /></div>
                  <div><label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>Dinner</label>
                  <textarea value={dietForm.dinner} onChange={e => setDietForm({...dietForm, dinner: e.target.value})} placeholder="e.g. Vegetable soup and salad" rows={2} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} /></div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div><label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>Morning Workout</label>
                  <textarea value={exerciseForm.morning} onChange={e => setExerciseForm({...exerciseForm, morning: e.target.value})} placeholder="e.g. 30 min cardio" rows={2} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} /></div>
                  <div><label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>Afternoon Activity</label>
                  <textarea value={exerciseForm.afternoon} onChange={e => setExerciseForm({...exerciseForm, afternoon: e.target.value})} placeholder="e.g. Light stretching" rows={2} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} /></div>
                  <div><label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>Evening Workout</label>
                  <textarea value={exerciseForm.evening} onChange={e => setExerciseForm({...exerciseForm, evening: e.target.value})} placeholder="e.g. 15 min yoga" rows={2} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} /></div>
                </div>
              )}
              <div style={{ marginTop: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>Expert Tips</label>
                <textarea value={type === 'diet' ? dietForm.tips : exerciseForm.tips} onChange={e => type === 'diet' ? setDietForm({...dietForm, tips: e.target.value}) : setExerciseForm({...exerciseForm, tips: e.target.value})} placeholder="Additional advice for the patient..." rows={3} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} />
              </div>
              <button type="submit" style={{ marginTop: 24, width: '100%', padding: 14, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)' }}>Save & Recommend to {selectedPatient.name.split(" ")[0]}</button>
            </form>
          ) : <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 0', fontSize: 15 }}>Select a patient from the list to recommend a personalized plan.</div>}
        </div>
      </div>
    </div>
  );
}
