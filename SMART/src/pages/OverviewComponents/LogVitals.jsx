import React, { useState, useEffect } from "react";
import './LogVitals.css';

function LogVitals({ user, onSave, onClose }) {
    const [vitals, setVitals] = useState({
        heartRate: "",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        bloodOxygen: "",
        bloodGlucose: "",
        temperature: "",
        weight: "",
        notes: ""
    });

    const [saved, setSaved] = useState(false);
    const [trends, setTrends] = useState([]);

    useEffect(() => {
        // Load previous vitals for trends
        const allVitals = JSON.parse(localStorage.getItem('vitals_history') || '[]');
        setTrends(allVitals.slice(-5));
    }, []);

    const handleChange = (e) => {
        setVitals({ ...vitals, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!vitals.heartRate && !vitals.bloodPressureSystolic) {
            alert("Please fill at least one vital sign");
            return;
        }

        const vitalsRecord = {
            id: Date.now(),
            ...vitals,
            patientName: user?.name || "Patient",
            timestamp: new Date().toLocaleString(),
            date: new Date().toISOString()
        };

        // Save to localStorage
        const existingVitals = JSON.parse(localStorage.getItem('vitals_history') || '[]');
        existingVitals.push(vitalsRecord);
        localStorage.setItem('vitals_history', JSON.stringify(existingVitals));

        // Save current vitals separately for quick access
        localStorage.setItem('current_vitals', JSON.stringify(vitals));

        setSaved(true);
        if (onSave) onSave(vitals);

        setTimeout(() => {
            setSaved(false);
            if (onClose) setTimeout(onClose, 2000);
        }, 3000);
    };

    const getStatus = (type, value) => {
        if (type === 'hr') {
            if (value < 60) return 'Low';
            if (value > 100) return 'High';
            return 'Normal';
        }
        if (type === 'oxygen') {
            if (value >= 95) return 'Good';
            return 'Low';
        }
        return '';
    };

    return (
        <div className="vitals-container">
            <div className="vitals-header">
                <h2 className="vitals-title">📊 Log Your Vitals</h2>
                <p className="vitals-subtitle">Track your health metrics regularly</p>
            </div>

            {!saved ? (
                <>
                    <div className="vitals-grid">
                        <div className="vital-card">
                            <label className="vital-label">❤️ Heart Rate (bpm)</label>
                            <input
                                type="number"
                                name="heartRate"
                                className="vital-input"
                                placeholder="e.g., 72"
                                value={vitals.heartRate}
                                onChange={handleChange}
                            />
                            {vitals.heartRate && (
                                <span className={`vital-status ${getStatus('hr', vitals.heartRate).toLowerCase()}`}>
                                    {getStatus('hr', vitals.heartRate)}
                                </span>
                            )}
                        </div>

                        <div className="vital-card">
                            <label className="vital-label">💙 Blood Pressure (Systolic)</label>
                            <input
                                type="number"
                                name="bloodPressureSystolic"
                                className="vital-input"
                                placeholder="e.g., 120"
                                value={vitals.bloodPressureSystolic}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="vital-card">
                            <label className="vital-label">💙 Blood Pressure (Diastolic)</label>
                            <input
                                type="number"
                                name="bloodPressureDiastolic"
                                className="vital-input"
                                placeholder="e.g., 80"
                                value={vitals.bloodPressureDiastolic}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="vital-card">
                            <label className="vital-label">🫁 Blood Oxygen (%)</label>
                            <input
                                type="number"
                                name="bloodOxygen"
                                className="vital-input"
                                placeholder="e.g., 98"
                                min="0"
                                max="100"
                                value={vitals.bloodOxygen}
                                onChange={handleChange}
                            />
                            {vitals.bloodOxygen && (
                                <span className={`vital-status ${getStatus('oxygen', vitals.bloodOxygen).toLowerCase()}`}>
                                    {getStatus('oxygen', vitals.bloodOxygen)}
                                </span>
                            )}
                        </div>

                        <div className="vital-card">
                            <label className="vital-label">🩸 Blood Glucose (mg/dL)</label>
                            <input
                                type="number"
                                name="bloodGlucose"
                                className="vital-input"
                                placeholder="e.g., 95"
                                value={vitals.bloodGlucose}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="vital-card">
                            <label className="vital-label">🌡️ Temperature (°F)</label>
                            <input
                                type="number"
                                name="temperature"
                                className="vital-input"
                                placeholder="e.g., 98.6"
                                step="0.1"
                                value={vitals.temperature}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="vital-card">
                            <label className="vital-label">⚖️ Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                className="vital-input"
                                placeholder="e.g., 70"
                                step="0.1"
                                value={vitals.weight}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="vital-card full-width">
                        <label className="vital-label">📝 Notes</label>
                        <textarea
                            name="notes"
                            className="vital-textarea"
                            placeholder="Any additional notes or symptoms..."
                            rows="3"
                            value={vitals.notes}
                            onChange={handleChange}
                        />
                    </div>

                    {trends.length > 0 && (
                        <div className="trends-section">
                            <h3 className="section-title">📈 Recent Trends</h3>
                            <div className="trends-list">
                                {trends.reverse().map((record, index) => (
                                    <div key={index} className="trend-item">
                                        <small>{new Date(record.timestamp).toLocaleDateString()}</small>
                                        {record.heartRate && <span>❤️ {record.heartRate} bpm</span>}
                                        {record.bloodOxygen && <span>🫁 {record.bloodOxygen}%</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="save-btn" onClick={handleSave}>
                        💾 Save Vitals
                    </button>
                </>
            ) : (
                <div className="success-card">
                    <div className="success-icon">✅</div>
                    <h3 className="success-title">Vitals Saved Successfully!</h3>
                    <div className="success-details">
                        {vitals.heartRate && <p>❤️ Heart Rate: {vitals.heartRate} bpm</p>}
                        {vitals.bloodPressureSystolic && <p>💙 BP: {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}</p>}
                        {vitals.bloodOxygen && <p>🫁 Blood Oxygen: {vitals.bloodOxygen}%</p>}
                        {vitals.bloodGlucose && <p>🩸 Blood Glucose: {vitals.bloodGlucose} mg/dL</p>}
                    </div>
                    <p className="success-message">Your health data has been recorded.</p>
                </div>
            )}
        </div>
    );
}

export default LogVitals;