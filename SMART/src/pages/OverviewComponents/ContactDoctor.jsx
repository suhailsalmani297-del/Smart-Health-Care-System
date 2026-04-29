import React, { useState } from "react";
import { DOCTORS as doctors } from "../../data/doctors";
import './ContactDoctor.css';

function ContactDoctor({ user, onClose }) {
    const [message, setMessage] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [subject, setSubject] = useState("");
    const [sent, setSent] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);


    const handleSend = () => {
        if (!selectedDoctor || !message) return;

        const newMessage = {
            id: Date.now(),
            doctor: selectedDoctor,
            subject: subject || "General Query",
            message: message,
            patientName: user?.name || "Patient",
            timestamp: new Date().toLocaleString(),
            status: "sent"
        };

        setChatHistory([newMessage, ...chatHistory]);

        // Save to localStorage
        const existingMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        existingMessages.unshift(newMessage);
        localStorage.setItem('messages', JSON.stringify(existingMessages));

        setSent(true);
        setMessage("");
        setSubject("");

        setTimeout(() => {
            setSent(false);
            if (onClose) setTimeout(onClose, 2000);
        }, 3000);
    };

    return (
        <div className="contact-container">
            <div className="contact-header">
                <h2 className="contact-title">💬 Message Doctor</h2>
                <p className="contact-subtitle">Get quick responses from your healthcare providers</p>
            </div>

            {!sent ? (
                <>
                    <div className="contact-section">
                        <h3 className="section-title">👨‍⚕️ Select Doctor</h3>
                        <select
                            className="doctor-select"
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                        >
                            <option value="">Choose a doctor...</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.name}>
                                    {doctor.name} - {doctor.spec}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="contact-section">
                        <h3 className="section-title">📋 Subject</h3>
                        <input
                            type="text"
                            className="subject-input"
                            placeholder="e.g., Follow-up question, Prescription renewal, Symptoms..."
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="contact-section">
                        <h3 className="section-title">✍️ Your Message</h3>
                        <textarea
                            className="message-input"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here... Please provide detailed information about your health concern."
                            rows="6"
                        />
                    </div>

                    <div className="contact-info">
                        <p>📌 <strong>Note:</strong> Doctors typically respond within 24 hours.</p>
                        <p>🔒 Your messages are secure and confidential.</p>
                    </div>

                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={!selectedDoctor || !message}
                    >
                        📤 Send Message
                    </button>
                </>
            ) : (
                <div className="success-card">
                    <div className="success-icon">✅</div>
                    <h3 className="success-title">Message Sent Successfully!</h3>
                    <div className="success-details">
                        <p><strong>To:</strong> {selectedDoctor}</p>
                        <p><strong>Subject:</strong> {subject || "General Query"}</p>
                        <p><strong>Message:</strong> {message}</p>
                    </div>
                    <p className="success-message">You will receive a response within 24 hours.</p>
                </div>
            )}

            {chatHistory.length > 0 && !sent && (
                <div className="chat-history">
                    <h3 className="section-title">📜 Recent Messages</h3>
                    {chatHistory.slice(0, 3).map(chat => (
                        <div key={chat.id} className="chat-message">
                            <div className="chat-header">
                                <strong>{chat.doctor}</strong>
                                <small>{chat.timestamp}</small>
                            </div>
                            <div className="chat-subject">{chat.subject}</div>
                            <div className="chat-text">{chat.message}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ContactDoctor;