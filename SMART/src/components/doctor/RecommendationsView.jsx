import React, { useState, useEffect } from 'react'

const DISEASES = [
  "Diabetes", "Hypertension", "Heart Disease", "Obesity", "Thyroid", 
  "PCOS/PCOD", "Cholesterol", "Anemia", "Asthma", "Arthritis"
];

export default function RecommendationsView({ doctor, addToast, saveRecommendation }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("diet");
  
  const [dietForm, setDietForm] = useState({
    dietType: "Veg",
    diseases: [],
    breakfast: "",
    midMorning: "",
    lunch: "",
    eveningSnack: "",
    dinner: "",
    waterIntake: "2-3 Liters",
    supplements: "",
    tips: ""
  });

  const [exerciseForm, setExerciseForm] = useState({
    morning: "",
    afternoon: "",
    evening: "",
    duration: "30 mins",
    intensity: "Moderate",
    tips: ""
  });

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem('appointments') || '[]');
    const myPatients = apps.filter(a => a.doctor.name === doctor.name).map(a => ({ email: a.email, name: a.patientName }));
    const unique = Array.from(new Set(myPatients.map(p => p.email))).map(email => myPatients.find(p => p.email === email));
    setPatients(unique);
  }, [doctor]);

  const toggleDisease = (disease) => {
    setDietForm(prev => {
      const exists = prev.diseases.includes(disease);
      if (exists) {
        return { ...prev, diseases: prev.diseases.filter(d => d !== disease) };
      } else {
        return { ...prev, diseases: [...prev.diseases, disease] };
      }
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      addToast("Please select a patient first", "err");
      return;
    }
    const data = activeTab === "diet" ? dietForm : exerciseForm;
    const planPayload = {
      patientEmail: selectedPatient.email,
      doctorEmail: doctor.email,
      doctorName: doctor.name,
      data,
      date: new Date().toISOString()
    };
    saveRecommendation(activeTab, planPayload);

    // Build a human-readable summary of the plan
    let planSummary = "";
    if (activeTab === "diet") {
      const d = dietForm;
      const lines = [];
      if (d.dietType)     lines.push(`Diet Type: ${d.dietType}`);
      if (d.diseases?.length) lines.push(`Conditions: ${d.diseases.join(", ")}`);
      if (d.breakfast)    lines.push(`Breakfast: ${d.breakfast}`);
      if (d.midMorning)   lines.push(`Mid-Morning: ${d.midMorning}`);
      if (d.lunch)        lines.push(`Lunch: ${d.lunch}`);
      if (d.eveningSnack) lines.push(`Evening Snack: ${d.eveningSnack}`);
      if (d.dinner)       lines.push(`Dinner: ${d.dinner}`);
      if (d.waterIntake)  lines.push(`Water Intake: ${d.waterIntake}`);
      if (d.supplements)  lines.push(`Supplements: ${d.supplements}`);
      if (d.tips)         lines.push(`Doctor's Advice: ${d.tips}`);
      planSummary = lines.join("\n");
    } else {
      const ex = exerciseForm;
      const lines = [];
      if (ex.morning)   lines.push(`Morning Routine: ${ex.morning}`);
      if (ex.afternoon) lines.push(`Afternoon Activity: ${ex.afternoon}`);
      if (ex.evening)   lines.push(`Evening Routine: ${ex.evening}`);
      if (ex.duration)  lines.push(`Duration: ${ex.duration}`);
      if (ex.intensity) lines.push(`Intensity: ${ex.intensity}`);
      if (ex.tips)      lines.push(`Safety Tips: ${ex.tips}`);
      planSummary = lines.join("\n");
    }

    // Push doctorPrescription notification to patient
    const notifs = JSON.parse(localStorage.getItem("shs_notifications") || "[]");
    notifs.push({
      id: Date.now(),
      to: selectedPatient.email,
      type: "doctorPrescription",
      planType: activeTab,
      doctorName: doctor.name,
      doctorSpec: doctor.spec || "",
      planDate: new Date().toISOString(),
      doctorPrescription: planSummary,
      planData: data,
      msg: `Dr. ${doctor.name} has shared a new ${activeTab === "diet" ? "Diet Plan 🥗" : "Exercise Plan 🏃"} for you.`,
      time: new Date().toISOString(),
    });
    localStorage.setItem("shs_notifications", JSON.stringify(notifs));

    addToast(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} plan saved & sent to ${selectedPatient.name}!`, "ok");
  };

  return (
    <div className="recommendations-container fade-up">
      <div className="rec-header">
        <div>
          <h2 className="rec-title">Smart Health Recommendations</h2>
          <p className="rec-subtitle">Create personalized diet and exercise plans for your patients</p>
        </div>
        <div className="rec-stats">
          <div className="rec-stat-card">
            <span className="stat-val">{patients.length}</span>
            <span className="stat-label">Total Patients</span>
          </div>
        </div>
      </div>

      <div className="rec-layout">
        {/* Patient Sidebar */}
        <div className="patient-sidebar card">
          <div className="sidebar-search">
            <input type="text" placeholder="Search patients..." />
          </div>
          <div className="patient-list">
            {patients.length === 0 ? (
              <div className="empty-state">No patients assigned yet.</div>
            ) : (
              patients.map(p => (
                <div 
                  key={p.email} 
                  className={`patient-item ${selectedPatient?.email === p.email ? 'active' : ''}`}
                  onClick={() => setSelectedPatient(p)}
                >
                  <div className="patient-avatar">{p.name.charAt(0)}</div>
                  <div className="patient-info">
                    <div className="patient-name">{p.name}</div>
                    <div className="patient-email">{p.email}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Form */}
        <div className="rec-content card">
          {selectedPatient ? (
            <div className="form-wrapper">
              <div className="selected-patient-badge">
                <span className="label">Recommending for:</span>
                <span className="name">{selectedPatient.name}</span>
              </div>

              <div className="tabs">
                <button 
                  className={`tab-btn ${activeTab === 'diet' ? 'active' : ''}`}
                  onClick={() => setActiveTab('diet')}
                >
                  🥗 Diet Plan
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'exercise' ? 'active' : ''}`}
                  onClick={() => setActiveTab('exercise')}
                >
                  🏃 Exercise Plan
                </button>
              </div>

              <form onSubmit={handleSave} className="plan-form">
                {activeTab === 'diet' ? (
                  <div className="form-sections">
                    <div className="form-section">
                      <h3>Diet Preferences & Conditions</h3>
                      <div className="input-group">
                        <label>Dietary Preference</label>
                        <div className="radio-group">
                          {["Veg", "Non-Veg", "Vegan", "Keto"].map(type => (
                            <label key={type} className={`radio-label ${dietForm.dietType === type ? 'checked' : ''}`}>
                              <input 
                                type="radio" 
                                name="dietType" 
                                value={type} 
                                checked={dietForm.dietType === type}
                                onChange={e => setDietForm({...dietForm, dietType: e.target.value})}
                              />
                              {type}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="input-group">
                        <label>Target Diseases / Conditions</label>
                        <div className="chip-group">
                          {DISEASES.map(d => (
                            <div 
                              key={d} 
                              className={`chip ${dietForm.diseases.includes(d) ? 'active' : ''}`}
                              onClick={() => toggleDisease(d)}
                            >
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>Meal Schedule</h3>
                      <div className="grid-2">
                        <div className="input-field">
                          <label>Breakfast</label>
                          <textarea 
                            placeholder="Breakfast details..."
                            value={dietForm.breakfast}
                            onChange={e => setDietForm({...dietForm, breakfast: e.target.value})}
                          />
                        </div>
                        <div className="input-field">
                          <label>Mid-Morning</label>
                          <textarea 
                            placeholder="Mid-morning snack..."
                            value={dietForm.midMorning}
                            onChange={e => setDietForm({...dietForm, midMorning: e.target.value})}
                          />
                        </div>
                        <div className="input-field">
                          <label>Lunch</label>
                          <textarea 
                            placeholder="Lunch details..."
                            value={dietForm.lunch}
                            onChange={e => setDietForm({...dietForm, lunch: e.target.value})}
                          />
                        </div>
                        <div className="input-field">
                          <label>Evening Snack</label>
                          <textarea 
                            placeholder="Evening snack..."
                            value={dietForm.eveningSnack}
                            onChange={e => setDietForm({...dietForm, eveningSnack: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="input-field full">
                        <label>Dinner</label>
                        <textarea 
                          placeholder="Dinner details..."
                          value={dietForm.dinner}
                          onChange={e => setDietForm({...dietForm, dinner: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>Additional Guidelines</h3>
                      <div className="grid-2">
                        <div className="input-field">
                          <label>Daily Water Intake</label>
                          <select 
                            value={dietForm.waterIntake}
                            onChange={e => setDietForm({...dietForm, waterIntake: e.target.value})}
                          >
                            <option>1-2 Liters</option>
                            <option>2-3 Liters</option>
                            <option>3-4 Liters</option>
                            <option>4+ Liters</option>
                          </select>
                        </div>
                        <div className="input-field">
                          <label>Supplements (if any)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Vitamin D, Omega 3"
                            value={dietForm.supplements}
                            onChange={e => setDietForm({...dietForm, supplements: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="input-field full">
                        <label>Doctor's Advice / Tips</label>
                        <textarea 
                          placeholder="General lifestyle advice..."
                          value={dietForm.tips}
                          onChange={e => setDietForm({...dietForm, tips: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="form-sections">
                    <div className="form-section">
                      <h3>Workout Schedule</h3>
                      <div className="input-field full">
                        <label>Morning Routine</label>
                        <textarea 
                          placeholder="e.g. 20 mins Yoga, 15 mins Walking"
                          value={exerciseForm.morning}
                          onChange={e => setExerciseForm({...exerciseForm, morning: e.target.value})}
                        />
                      </div>
                      <div className="input-field full">
                        <label>Afternoon Activity</label>
                        <textarea 
                          placeholder="e.g. Light stretches, avoiding sitting"
                          value={exerciseForm.afternoon}
                          onChange={e => setExerciseForm({...exerciseForm, afternoon: e.target.value})}
                        />
                      </div>
                      <div className="input-field full">
                        <label>Evening Routine</label>
                        <textarea 
                          placeholder="e.g. Gym session, Swimming"
                          value={exerciseForm.evening}
                          onChange={e => setExerciseForm({...exerciseForm, evening: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>Intensity & Duration</h3>
                      <div className="grid-2">
                        <div className="input-field">
                          <label>Total Duration</label>
                          <select 
                            value={exerciseForm.duration}
                            onChange={e => setExerciseForm({...exerciseForm, duration: e.target.value})}
                          >
                            <option>15 mins</option>
                            <option>30 mins</option>
                            <option>45 mins</option>
                            <option>1 hour</option>
                            <option>1.5 hours+</option>
                          </select>
                        </div>
                        <div className="input-field">
                          <label>Intensity Level</label>
                          <select 
                            value={exerciseForm.intensity}
                            onChange={e => setExerciseForm({...exerciseForm, intensity: e.target.value})}
                          >
                            <option>Sedentary/Very Light</option>
                            <option>Light</option>
                            <option>Moderate</option>
                            <option>High</option>
                            <option>Very High/Athlete</option>
                          </select>
                        </div>
                      </div>
                      <div className="input-field full">
                        <label>Safety Tips & Advice</label>
                        <textarea 
                          placeholder="e.g. Warm up before start, stay hydrated..."
                          value={exerciseForm.tips}
                          onChange={e => setExerciseForm({...exerciseForm, tips: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Save & Recommend Plan
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="no-selection">
              <div className="icon">🏥</div>
              <h3>No Patient Selected</h3>
              <p>Please select a patient from the left sidebar to start creating a personalized health plan.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .recommendations-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          color: #1e293b;
        }

        .rec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .rec-title {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .rec-subtitle {
          color: #64748b;
          font-size: 15px;
        }

        .rec-stat-card {
          background: white;
          padding: 15px 25px;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-val {
          font-size: 24px;
          font-weight: 800;
          color: #0ea5e9;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .rec-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 24px;
          height: calc(100vh - 200px);
        }

        .card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          border: 1px solid #f1f5f9;
          overflow: hidden;
        }

        .patient-sidebar {
          display: flex;
          flex-direction: column;
        }

        .sidebar-search {
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .sidebar-search input {
          width: 100%;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          outline: none;
          font-size: 14px;
        }

        .patient-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }

        .patient-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 4px;
        }

        .patient-item:hover {
          background: #f1f5f9;
        }

        .patient-item.active {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }

        .patient-avatar {
          width: 40px;
          height: 40px;
          background: #0ea5e9;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }

        .patient-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
        }

        .patient-email {
          font-size: 12px;
          color: #64748b;
        }

        .rec-content {
          display: flex;
          flex-direction: column;
          background: white;
          padding: 0;
          overflow-y: auto;
        }

        .form-wrapper {
          padding: 30px;
        }

        .selected-patient-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0f9ff;
          padding: 10px 16px;
          border-radius: 40px;
          width: fit-content;
          margin-bottom: 24px;
          border: 1px solid #bae6fd;
        }

        .selected-patient-badge .label {
          font-size: 13px;
          color: #0369a1;
          font-weight: 600;
        }

        .selected-patient-badge .name {
          font-size: 14px;
          color: #0ea5e9;
          font-weight: 800;
        }

        .tabs {
          display: flex;
          gap: 8px;
          background: #f1f5f9;
          padding: 6px;
          border-radius: 16px;
          margin-bottom: 30px;
        }

        .tab-btn {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: white;
          color: #0ea5e9;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .form-sections {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .form-section h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 2px solid #f1f5f9;
          color: #334155;
        }

        .input-group {
          margin-bottom: 24px;
        }

        .input-group label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .radio-group {
          display: flex;
          gap: 12px;
        }

        .radio-label {
          padding: 10px 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .radio-label.checked {
          background: #0ea5e9;
          color: white;
          border-color: #0ea5e9;
        }

        .radio-label input {
          display: none;
        }

        .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          padding: 8px 16px;
          background: #f1f5f9;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .chip:hover {
          background: #e2e8f0;
        }

        .chip.active {
          background: #dcfce7;
          color: #166534;
          border-color: #bbf7d0;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-field {
          margin-bottom: 16px;
        }

        .input-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
        }

        .input-field textarea, .input-field select, .input-field input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px;
          outline: none;
          transition: border 0.2s;
        }

        .input-field textarea {
          min-height: 80px;
          resize: vertical;
        }

        .input-field textarea:focus, .input-field select:focus, .input-field input:focus {
          border-color: #0ea5e9;
          background: white;
        }

        .form-actions {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #f1f5f9;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #0ea5e9, #2563eb);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.3);
        }

        .no-selection {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px;
          color: #94a3b8;
        }

        .no-selection .icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .no-selection h3 {
          color: #475569;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
