import React, { useState, useEffect } from "react";
import './ViewRecord.css';

function ViewRecord({ user, onClose }) {
    const [activeTab, setActiveTab] = useState('vitals');
    const [vitals, setVitals] = useState(null);
    const [vitalsHistory, setVitalsHistory] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Load all data
        const currentVitals = JSON.parse(localStorage.getItem('current_vitals'));
        const allVitals = JSON.parse(localStorage.getItem('vitals_history') || '[]');
        const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');

        setVitals(currentVitals);
        setVitalsHistory(allVitals.reverse());
        setAppointments(allAppointments.reverse());
        setMessages(allMessages);
    }, []);

    const getHealthScore = () => {
        if (!vitals) return 'N/A';
        let score = 100;
        if (vitals.heartRate && (vitals.heartRate < 60 || vitals.heartRate > 100)) score -= 20;
        if (vitals.bloodOxygen && vitals.bloodOxygen < 95) score -= 25;
        if (vitals.bloodGlucose && (vitals.bloodGlucose < 70 || vitals.bloodGlucose > 140)) score -= 20;
        return score;
    };

    return (
        <div className="records-container">
            <div className="records-header">
                <h2 className="records-title">📋 Health Records</h2>
                <p className="records-subtitle">Complete health history at a glance</p>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'vitals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('vitals')}
                >
                    ❤️ Vitals
                </button>
                <button
                    className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('appointments')}
                >
                    📅 Appointments
                </button>
                <button
                    className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
                    onClick={() => setActiveTab('messages')}
                >
                    💬 Messages
                </button>
                <button
                    className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summary')}
                >
                    📊 Summary
                </button>
            </div>

            {activeTab === 'vitals' && (
                <div className="tab-content">
                    <div className="current-vitals">
                        <h3 className="section-title">Current Vitals</h3>
                        {vitals ? (
                            <div className="vitals-display">
                                <div className="vital-item">
                                    <span className="vital-icon">❤️</span>
                                    <div>
                                        <strong>Heart Rate</strong>
                                        <p>{vitals.heartRate || '—'} bpm</p>
                                    </div>
                                </div>
                                <div className="vital-item">
                                    <span className="vital-icon">💙</span>
                                    <div>
                                        <strong>Blood Pressure</strong>
                                        <p>{vitals.bloodPressureSystolic || '—'}/{vitals.bloodPressureDiastolic || '—'}</p>
                                    </div>
                                </div>
                                <div className="vital-item">
                                    <span className="vital-icon">🫁</span>
                                    <div>
                                        <strong>Blood Oxygen</strong>
                                        <p>{vitals.bloodOxygen || '—'}%</p>
                                    </div>
                                </div>
                                <div className="vital-item">
                                    <span className="vital-icon">🩸</span>
                                    <div>
                                        <strong>Blood Glucose</strong>
                                        <p>{vitals.bloodGlucose || '—'} mg/dL</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="no-data">No vitals recorded yet. Please log your vitals.</p>
                        )}
                    </div>

                    <div className="vitals-history">
                        <h3 className="section-title">History</h3>
                        {vitalsHistory.length > 0 ? (
                            <div className="history-list">
                                {vitalsHistory.map((record, index) => (
                                    <div key={index} className="history-item">
                                        <div className="history-date">{record.timestamp}</div>
                                        <div className="history-data">
                                            {record.heartRate && <span>❤️ {record.heartRate} bpm</span>}
                                            {record.bloodPressureSystolic && <span>💙 {record.bloodPressureSystolic}/{record.bloodPressureDiastolic}</span>}
                                            {record.bloodOxygen && <span>🫁 {record.bloodOxygen}%</span>}
                                            {record.bloodGlucose && <span>🩸 {record.bloodGlucose} mg/dL</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-data">No history available</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'appointments' && (
                <div className="tab-content">
                    {appointments.length > 0 ? (
                        <div className="appointments-list">
                            {appointments.map((apt, index) => (
                                <div key={index} className="appointment-record">
                                    <div className="appointment-header">
                                        <strong>{apt.doctor?.name || apt.doctor}</strong>
                                        <span className="appointment-id">ID: {apt.id || apt.bookingId}</span>
                                    </div>
                                    <div className="appointment-details">
                                        <p>📅 Date: {new Date(apt.date).toLocaleDateString()}</p>
                                        <p>⏰ Time: {apt.slot || apt.time}</p>
                                        {apt.problem && <p>📝 Problem: {apt.problem}</p>}
                                        <p>👤 Patient: {apt.patientName}</p>
                                        <p>🕒 Booked on: {new Date(apt.bookedAt || apt.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">No appointments found. Book your first appointment!</p>
                    )}
                </div>
            )}

            {activeTab === 'messages' && (
                <div className="tab-content">
                    {messages.length > 0 ? (
                        <div className="messages-list">
                            {messages.map((msg, index) => (
                                <div key={index} className="message-record">
                                    <div className="message-header">
                                        <strong>To: {msg.doctor}</strong>
                                        <small>{msg.timestamp}</small>
                                    </div>
                                    <div className="message-subject">Subject: {msg.subject}</div>
                                    <div className="message-body">{msg.message}</div>
                                    <div className="message-status">Status: {msg.status || 'Sent'}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">No messages sent yet.</p>
                    )}
                </div>
            )}

            {activeTab === 'summary' && (
                <div className="tab-content">
                    <div className="health-summary">
                        <h3 className="section-title">Health Score</h3>
                        <div className="health-score">
                            <div className="score-circle">{getHealthScore()}</div>
                            <p>Overall Health Score</p>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <h4>Total Vitals Recorded</h4>
                                <p className="stat-number">{vitalsHistory.length}</p>
                            </div>
                            <div className="stat-card">
                                <h4>Total Appointments</h4>
                                <p className="stat-number">{appointments.length}</p>
                            </div>
                            <div className="stat-card">
                                <h4>Messages Sent</h4>
                                <p className="stat-number">{messages.length}</p>
                            </div>
                        </div>

                        <div className="recommendations">
                            <h3 className="section-title">Recommendations</h3>
                            <ul>
                                {vitalsHistory.length === 0 && <li>📊 Start logging your vitals regularly to track your health</li>}
                                {appointments.length === 0 && <li>🏥 Schedule regular checkups with your doctor</li>}
                                {vitals?.heartRate > 100 && <li>❤️ Your heart rate is high. Consider consulting a doctor.</li>}
                                {vitals?.bloodOxygen < 95 && <li>🫁 Your blood oxygen level is low. Please seek medical attention.</li>}
                                <li>✅ Keep tracking your health metrics daily</li>
                                <li>📱 Enable reminders for medication and appointments</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewRecord;