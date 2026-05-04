import React, { useState, useEffect } from 'react'
import { T } from './Constants'

function PrescriptionCard({ n }) {
  const [expanded, setExpanded] = useState(false);
  const isDiet = n.planType === "diet";

  return (
    <div style={{
      background: isDiet ? "#F0FFF4" : "#F0F4FF",
      border: `1px solid ${isDiet ? "#BBF7D0" : "#BFDBFE"}`,
      borderRadius: 16,
      marginBottom: 14,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      transition: "all 0.2s",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
        background: isDiet
          ? "linear-gradient(135deg, #D1FAE5, #A7F3D0)"
          : "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
        borderBottom: expanded ? `1px solid ${isDiet ? "#86EFAC" : "#93C5FD"}` : "none",
        cursor: "pointer",
      }} onClick={() => setExpanded(v => !v)}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: isDiet ? "#059669" : "#2563EB",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}>
          {isDiet ? "🥗" : "🏃"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14.5, color: isDiet ? "#064E3B" : "#1E3A8A" }}>
            {isDiet ? "Diet Plan" : "Exercise Plan"} — from Dr. {n.doctorName}
          </div>
          {n.doctorSpec && (
            <div style={{ fontSize: 11.5, color: isDiet ? "#047857" : "#1D4ED8", marginTop: 2 }}>
              {n.doctorSpec}
            </div>
          )}
          <div style={{ fontSize: 11, color: isDiet ? "#065F46" : "#1E40AF", marginTop: 3 }}>
            📅 {new Date(n.planDate || n.time).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, padding: "5px 12px",
          borderRadius: 99,
          background: isDiet ? "#059669" : "#2563EB",
          color: "white",
          userSelect: "none",
        }}>
          {expanded ? "Hide ▲" : "View Plan ▼"}
        </div>
      </div>

      {/* Expanded Prescription Body */}
      {expanded && (
        <div style={{ padding: "20px 24px" }}>
          <div style={{
            fontSize: 12, fontWeight: 700, letterSpacing: 1,
            color: isDiet ? "#047857" : "#1D4ED8",
            textTransform: "uppercase", marginBottom: 14,
          }}>
            📋 Doctor's Prescription
          </div>
          <div style={{
            background: "white", borderRadius: 12,
            border: `1px solid ${isDiet ? "#A7F3D0" : "#BFDBFE"}`,
            padding: "16px 20px",
            fontSize: 13.5, lineHeight: 1.9, color: T.textMd,
            whiteSpace: "pre-line",
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>
            {n.doctorPrescription || "No details provided."}
          </div>
          <div style={{
            marginTop: 12, fontSize: 11.5, color: T.muted, textAlign: "right"
          }}>
            Prescribed on {new Date(n.planDate || n.time).toLocaleString("en-IN")}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NotificationsHistory({ user }) {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('shs_notifications') || '[]');
    setNotifs(all.filter(n => n.to === user.email).reverse());
  }, [user]);

  const prescriptions = notifs.filter(n => n.type === "doctorPrescription");
  const regular = notifs.filter(n => n.type !== "doctorPrescription");

  return (
    <div className="fade-up">
      <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: "0 0 22px" }}>
        Notifications
      </h1>

      {/* Doctor Prescriptions Section */}
      {prescriptions.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #059669, #2563EB)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>💊</div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: 0 }}>
              Doctor's Diet &amp; Exercise Plans
            </h2>
            <span style={{
              background: T.blueLt, color: T.blue,
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
            }}>
              {prescriptions.length} Plan{prescriptions.length > 1 ? "s" : ""}
            </span>
          </div>
          {prescriptions.map(n => (
            <PrescriptionCard key={n.id} n={n} />
          ))}
        </div>
      )}

      {/* Regular Notifications Section */}
      <div style={{
        background: T.surface, borderRadius: 20, padding: 26,
        boxShadow: T.sh2, border: `1px solid ${T.border}`
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: "0 0 16px" }}>
          🔔 General Notifications
        </h2>
        {regular.length === 0 ? (
          <p style={{ textAlign: 'center', color: T.muted, padding: "20px 0" }}>
            No general notifications.
          </p>
        ) : (
          regular.map(n => (
            <div key={n.id} style={{
              padding: '16px 0', borderBottom: `1px solid ${T.border}`,
              display: 'flex', gap: 12, alignItems: 'flex-start'
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: n.type === 'appointment' ? T.blueLt : T.greenLt,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0
              }}>
                {n.type === 'appointment' ? '📅' : '💬'}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{n.msg}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
                  {new Date(n.time).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
        {notifs.length === 0 && (
          <p style={{ textAlign: 'center', color: T.muted, padding: "20px 0" }}>
            No new notifications.
          </p>
        )}
      </div>
    </div>
  );
}
