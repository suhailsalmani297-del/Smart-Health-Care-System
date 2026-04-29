import React, { useState } from 'react'

const API = '/api'

const initialForm = {
  age: '', gender: 'male', weight: '', height: '',
  daily_steps: '', sleep_hours: '', water_intake: '',
  calories: '', smoker: 'no', alcohol: 'no',
  resting_hr: '', systolic_bp: '', diastolic_bp: '',
  cholesterol: '', family_history: 'no',
}

export default function Predict() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch(`${API}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      setResult(data)
    } catch {
      setError('Cannot reach the backend server. Please ensure Flask is running on port 5000.')
    }
    setLoading(false)
  }

  // Custom risk level logic
  let riskLevel = ''
  let isHigh = false
  let isModerate = false
  let isLow = false
  if (result) {
    const prob = Number(result.risk_probability)
    if (prob <= 30) {
      riskLevel = 'Low'
      isLow = true
    } else if (prob <= 50) {
      riskLevel = 'Moderate'
      isModerate = true
    } else {
      riskLevel = 'High'
      isHigh = true
    }
  }

  return (
    <div className="dp-page">
      <div className="dp-page-header">
        <h2 className="dp-page-title">AI Health Risk Prediction</h2>
        <p className="dp-page-sub">Enter your health data below and our AI model will assess your disease risk.</p>
      </div>

      <div className="predict-layout">
        {/* Form */}
        <form className="predict-form dp-box" onSubmit={handleSubmit}>
          <div className="pf-section-title">Personal Information</div>
          <div className="pf-grid">
            <div className="pf-field">
              <label>Age</label>
              <input type="number" placeholder="e.g. 35" min="1" max="120" value={form.age} onChange={e => set('age', e.target.value)} required />
            </div>
            <div className="pf-field">
              <label>Gender</label>
              <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="pf-field">
              <label>Weight (kg)</label>
              <input type="number" placeholder="e.g. 70" min="20" max="300" value={form.weight} onChange={e => set('weight', e.target.value)} required />
            </div>
            <div className="pf-field">
              <label>Height (cm)</label>
              <input type="number" placeholder="e.g. 170" min="100" max="250" value={form.height} onChange={e => set('height', e.target.value)} required />
            </div>
          </div>

          <div className="pf-section-title">Lifestyle</div>
          <div className="pf-grid">
            <div className="pf-field">
              <label>Daily Steps</label>
              <input type="number" placeholder="e.g. 7000" value={form.daily_steps} onChange={e => set('daily_steps', e.target.value)} required />
            </div>
            <div className="pf-field">
              <label>Sleep Hours</label>
              <input type="number" step="0.5" placeholder="e.g. 7" min="1" max="24" value={form.sleep_hours} onChange={e => set('sleep_hours', e.target.value)} required />
            </div>
            <div className="pf-field">
              <label>Water Intake (L)</label>
              <input type="number" step="0.1" placeholder="e.g. 2.5" value={form.water_intake} onChange={e => set('water_intake', e.target.value)} required />
            </div>
            <div className="pf-field">
              <label>Daily Calories (kcal)</label>
              <input type="number" placeholder="e.g. 2000" value={form.calories} onChange={e => set('calories', e.target.value)} required />
            </div>
            <div className="pf-field">
              <label>Smoker</label>
              <select value={form.smoker} onChange={e => set('smoker', e.target.value)}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div className="pf-field">
              <label>Alcohol Use</label>
              <select value={form.alcohol} onChange={e => set('alcohol', e.target.value)}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          <div className="pf-section-title">Clinical Measurements</div>
          <div className="pf-grid">
            <div className="pf-field">
              <label>Resting HR (bpm)</label>
              <input type="number" placeholder="e.g. 72" value={form.resting_hr} onChange={e => set('resting_hr', e.target.value)} required />
            </div>
            <div className="pf-field">
              <label>Systolic BP (mmHg)</label>
              <input type="number" placeholder="e.g. 120" value={form.systolic_bp} onChange={e => set('systolic_bp', e.target.value)} required />
            </div>
            <div className="pf-field">
              <label>Diastolic BP (mmHg)</label>
              <input type="number" placeholder="e.g. 80" value={form.diastolic_bp} onChange={e => set('diastolic_bp', e.target.value)} required />
            </div>
            <div className="pf-field">
              <label>Cholesterol (mg/dL)</label>
              <input type="number" placeholder="e.g. 180" value={form.cholesterol} onChange={e => set('cholesterol', e.target.value)} required />
            </div>
            <div className="pf-field">
              <label>Family History of Disease</label>
              <select value={form.family_history} onChange={e => set('family_history', e.target.value)}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          {error && <div className="pf-error">⚠️ {error}</div>}

          <button className="pf-submit" type="submit" disabled={loading}>
            {loading ? <><span className="pf-spinner" /> Analysing…</> : '🔍 Predict Health Risk'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className={`predict-result dp-box ${isHigh ? 'result-high' : isModerate ? 'result-moderate' : 'result-low'}`}>
            <div className="pr-badge" style={{ 
              background: isHigh ? '#fee2e2' : isModerate ? '#fef9c3' : '#dcfce7', 
              color: isHigh ? '#dc2626' : isModerate ? '#b45309' : '#16a34a' 
            }}>
              {isHigh ? '⚠️ High Risk' : isModerate ? '🟠 Moderate Risk' : '✅ Low Risk'}
            </div>
            <div className="pr-percent" style={{ color: isHigh ? '#dc2626' : isModerate ? '#b45309' : '#16a34a' }}>
              {result.risk_probability}%
            </div>
            <div className="pr-risk-label">Disease Risk Score</div>

            <div className="pr-bar-track">
              <div className="pr-bar-fill" style={{
                width: result.risk_probability + '%',
                background: isHigh 
                  ? 'linear-gradient(90deg,#ef4444,#fca5a5)'
                  : isModerate
                    ? 'linear-gradient(90deg,#f59e0b,#fde68a)'
                    : 'linear-gradient(90deg,#16a34a,#4ade80)'
              }} />
            </div>

            <div className="pr-bmi">
              <span>Calculated BMI</span>
              <strong>{result.bmi}</strong>
            </div>

            <div className="pr-recs-title">Health Recommendations & Risk Factors</div>
            <div className="pr-diseases" style={{ marginBottom: '1rem' }}>
              <strong>Possible Health Concerns:</strong>
              <ul style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                {result.possible_diseases.map((d, i) => (
                  <li key={i} style={{ color: '#dc2626', fontWeight: '500' }}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="pr-recs-title">Health Tips</div>
            <ul className="pr-recs">
              {result.health_tips.map((r, i) => (
                <li key={i}>
                  <span className="pr-rec-dot" style={{ background: isHigh ? '#dc2626' : isModerate ? '#f59e0b' : '#16a34a' }} />
                  {r}
                </li>
              ))}
            </ul>

            <button className="pr-reset" onClick={() => { setResult(null); setForm(initialForm) }}>
              Run Another Prediction
            </button>
          </div>
        )}

        {!result && !loading && (
          <div className="predict-guide dp-box">
            <div className="pg-header">
              <span className="pg-icon">📊</span>
              <h3 className="pg-title">Normal Health Ranges</h3>
            </div>
            <p className="pg-desc">Use this guide to understand the healthy clinical and lifestyle ranges for your prediction.</p>
            
            <div className="pg-list">
              <div className="pg-item">
                <div className="pg-item-header">
                  <span className="pg-item-name">🩸 Blood Pressure</span>
                  <span className="pg-item-val">{'<'} 120/80 mmHg</span>
                </div>
                <div className="pg-item-desc">Systolic should be under 120 and Diastolic under 80.</div>
              </div>
              
              <div className="pg-item">
                <div className="pg-item-header">
                  <span className="pg-item-name">💓 Resting Heart Rate</span>
                  <span className="pg-item-val">60 - 100 bpm</span>
                </div>
                <div className="pg-item-desc">Athletes may have lower resting heart rates (40-60 bpm).</div>
              </div>

              <div className="pg-item">
                <div className="pg-item-header">
                  <span className="pg-item-name">🫀 Cholesterol</span>
                  <span className="pg-item-val">{'<'} 200 mg/dL</span>
                </div>
                <div className="pg-item-desc">Total cholesterol below 200 is optimal for heart health.</div>
              </div>

              <div className="pg-item">
                <div className="pg-item-header">
                  <span className="pg-item-name">🚶 Daily Steps</span>
                  <span className="pg-item-val">8,000 - 10k+</span>
                </div>
                <div className="pg-item-desc">Keeps cardiovascular system active and burns calories.</div>
              </div>

              <div className="pg-item">
                <div className="pg-item-header">
                  <span className="pg-item-name">😴 Sleep Hours</span>
                  <span className="pg-item-val">7 - 9 hours</span>
                </div>
                <div className="pg-item-desc">Crucial for muscle recovery and mental well-being.</div>
              </div>

              <div className="pg-item">
                <div className="pg-item-header">
                  <span className="pg-item-name">💧 Water Intake</span>
                  <span className="pg-item-val">2.5 - 3.5 Liters</span>
                </div>
                <div className="pg-item-desc">Helps in digestion, skin health, and kidney function.</div>
              </div>
            </div>

            <div className="pg-tip">
              <strong>💡 Pro Tip:</strong> If your values are outside these ranges, our AI might indicate a higher risk. Always consult a real doctor for medical advice.
            </div>
          </div>
        )}
      </div>

      {/* External Prediction Links Section */}
      <div className="fade-up" style={{ marginTop: '60px', borderTop: '2px solid #f1f5f9', paddingTop: '50px', paddingBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '12px', fontFamily: "'Bricolage Grotesque', sans-serif" }}>Other Disease Predictions</h3>
          <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>Enhance your diagnostic journey with our specialized healthcare AI modules designed for precise health assessments.</p>
        </div>
        
        <div className="external-links-grid">
          {/* Card 1: Skin Cancer */}
          <a href="#" className="ext-card card-blue-red">
            <div className="ext-icon">🔬</div>
            <h4 className="ext-title">Skin Cancer Prediction</h4>
            <p className="ext-desc">Advanced dermatological analysis for early detection of skin conditions.</p>
            <div className="ext-badge">Live Module</div>
          </a>
          
          {/* Card 2: Heart Disease */}
          <a href="#" className="ext-card card-blue-red">
            <div className="ext-icon">🫀</div>
            <h4 className="ext-title">Heart Disease Analysis</h4>
            <p className="ext-desc">Comprehensive cardiovascular risk profiling and structural heart health.</p>
            <div className="ext-badge">Live Module</div>
          </a>

          {/* Card 3: Placeholder */}
          <div className="ext-card card-disabled">
            <div className="ext-icon">🏥</div>
            <h4 className="ext-title">Diabetes Management</h4>
            <p className="ext-desc">AI-powered glucose tracking and insulin sensitivity predictions.</p>
            <div className="ext-badge-soon">Coming Soon</div>
          </div>

          {/* Card 4: Placeholder */}
          <div className="ext-card card-disabled">
            <div className="ext-icon">🧬</div>
            <h4 className="ext-title">Brain Tumor Detection</h4>
            <p className="ext-desc">Neural network analysis of MRI scans for precise tumor localization.</p>
            <div className="ext-badge-soon">Coming Soon</div>
          </div>
        </div>

        <style>{`
          .external-links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 28px;
            padding: 10px;
          }
          .ext-card {
            background: white;
            border-radius: 28px;
            padding: 40px 30px;
            text-align: center;
            text-decoration: none;
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
            border: 1px solid #f1f5f9;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          }
          .ext-icon {
            font-size: 52px;
            margin-bottom: 24px;
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1));
            transition: transform 0.5s ease;
          }
          .ext-title {
            font-size: 20px;
            fontWeight: 800;
            color: #1e293b;
            margin-bottom: 12px;
            font-family: 'Bricolage Grotesque', sans-serif;
          }
          .ext-desc {
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .ext-badge {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 5px 12px;
            border-radius: 99px;
            background: #e0f2fe;
            color: #0369a1;
          }
          .ext-badge-soon {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 5px 12px;
            border-radius: 99px;
            background: #f1f5f9;
            color: #94a3b8;
          }
          
          .card-blue-red:hover {
            transform: translateY(-15px) scale(1.02);
            background: linear-gradient(135deg, #2563eb 0%, #dc2626 100%);
            border-color: transparent;
            box-shadow: 0 25px 50px rgba(37, 99, 235, 0.3);
          }
          .card-blue-red:hover .ext-title,
          .card-blue-red:hover .ext-desc {
            color: white;
          }
          .card-blue-red:hover .ext-icon {
            transform: scale(1.2) rotate(5deg);
          }
          .card-blue-red:hover .ext-badge {
            background: rgba(255,255,255,0.2);
            color: white;
          }
          
          .card-disabled {
            opacity: 0.8;
            filter: grayscale(0.5);
            cursor: default;
          }
          
          .fade-up {
            animation: fadeUp 0.8s ease-out forwards;
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  )
}
