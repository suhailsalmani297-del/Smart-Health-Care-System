import React, { useState, useEffect } from 'react'
import { T } from './Constants'

/* ─── Single Plan Card ─── */
function PlanCard({ plan, type }) {
  const [expanded, setExpanded] = useState(false);
  const isDiet = type === "diet";
  const d = plan.data || {};

  const rows = isDiet ? [
    d.dietType     && { label: "🍽️ Diet Type",       val: d.dietType },
    d.diseases?.length && { label: "🩺 Conditions",   val: d.diseases.join(", ") },
    d.breakfast    && { label: "🌅 Breakfast",        val: d.breakfast },
    d.midMorning   && { label: "☕ Mid-Morning",      val: d.midMorning },
    d.lunch        && { label: "🍛 Lunch",            val: d.lunch },
    d.eveningSnack && { label: "🍎 Evening Snack",    val: d.eveningSnack },
    d.dinner       && { label: "🌙 Dinner",           val: d.dinner },
    d.waterIntake  && { label: "💧 Water Intake",     val: d.waterIntake },
    d.supplements  && { label: "💊 Supplements",      val: d.supplements },
    d.tips         && { label: "📝 Doctor's Advice",  val: d.tips },
  ].filter(Boolean) : [
    d.morning   && { label: "🌅 Morning Routine",     val: d.morning },
    d.afternoon && { label: "☀️ Afternoon Activity",  val: d.afternoon },
    d.evening   && { label: "🌆 Evening Routine",     val: d.evening },
    d.duration  && { label: "⏱️ Duration",            val: d.duration },
    d.intensity && { label: "⚡ Intensity",            val: d.intensity },
    d.tips      && { label: "📝 Safety Tips",          val: d.tips },
  ].filter(Boolean);

  return (
    <div style={{
      background: isDiet ? "#F0FFF4" : "#EFF6FF",
      border: `1.5px solid ${isDiet ? "#BBF7D0" : "#BFDBFE"}`,
      borderRadius: 20,
      marginBottom: 18,
      overflow: "hidden",
      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      transition: "all 0.25s",
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "18px 22px",
          background: isDiet
            ? "linear-gradient(135deg, #D1FAE5, #A7F3D0)"
            : "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
          cursor: "pointer",
          borderBottom: expanded ? `1px solid ${isDiet ? "#86EFAC" : "#93C5FD"}` : "none",
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: isDiet ? "#059669" : "#2563EB",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, flexShrink: 0,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>
          {isDiet ? "🥗" : "🏃"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 800, fontSize: 15,
            color: isDiet ? "#064E3B" : "#1E3A8A"
          }}>
            {isDiet ? "Diet Plan" : "Exercise Plan"}
          </div>
          <div style={{ fontSize: 12, color: isDiet ? "#047857" : "#1D4ED8", marginTop: 2 }}>
            by Dr. {plan.doctorName}
          </div>
          <div style={{ fontSize: 11, color: isDiet ? "#065F46" : "#1E40AF", marginTop: 3 }}>
            📅 {new Date(plan.date).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, padding: "6px 14px",
          borderRadius: 99,
          background: isDiet ? "#059669" : "#2563EB",
          color: "white", userSelect: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}>
          {expanded ? "Hide Details ▲" : "View Full Plan ▼"}
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div style={{ padding: "22px 26px" }}>
          <div style={{
            fontSize: 12, fontWeight: 800, letterSpacing: 1,
            color: isDiet ? "#047857" : "#1D4ED8",
            textTransform: "uppercase", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>📋</span>
            Doctor's Prescription Details
          </div>

          {rows.length === 0 ? (
            <div style={{ color: T.muted, fontSize: 13, textAlign: "center", padding: 20 }}>
              No details provided.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rows.map((row, i) => (
                <div key={i} style={{
                  display: "flex", gap: 14, alignItems: "flex-start",
                  padding: "12px 16px",
                  background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                  borderRadius: 12,
                  border: `1px solid ${isDiet ? "#D1FAE5" : "#DBEAFE"}`,
                }}>
                  <div style={{
                    minWidth: 140, fontSize: 12.5, fontWeight: 700,
                    color: isDiet ? "#065F46" : "#1E40AF",
                    paddingTop: 1,
                  }}>
                    {row.label}
                  </div>
                  <div style={{
                    flex: 1, fontSize: 13.5, color: T.textMd,
                    lineHeight: 1.7, whiteSpace: "pre-line",
                  }}>
                    {row.val}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{
            marginTop: 16, fontSize: 11, color: T.muted, textAlign: "right",
            fontStyle: "italic",
          }}>
            Prescribed on {new Date(plan.date).toLocaleString("en-IN")}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main: Doctor Plans Page ─── */
export default function DoctorPlans({ user }) {
  const [dietPlans, setDietPlans]       = useState([]);
  const [exercisePlans, setExercisePlans] = useState([]);
  const [tab, setTab]                    = useState("all");

  useEffect(() => {
    const diets     = JSON.parse(localStorage.getItem("shs_diet_plans")     || "[]");
    const exercises = JSON.parse(localStorage.getItem("shs_exercise_plans") || "[]");
    setDietPlans(diets.filter(p => p.patientEmail === user.email));
    setExercisePlans(exercises.filter(p => p.patientEmail === user.email));
  }, [user]);

  const allPlans = [
    ...dietPlans.map(p => ({ ...p, _type: "diet" })),
    ...exercisePlans.map(p => ({ ...p, _type: "exercise" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredPlans = tab === "all"
    ? allPlans
    : allPlans.filter(p => p._type === tab);

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0 }}>
            Doctor's Health Plans
          </h1>
          <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
            Diet & Exercise plans prescribed by your doctors
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{
            background: "#D1FAE5", color: "#064E3B",
            padding: "8px 14px", borderRadius: 12,
            fontSize: 12, fontWeight: 700, textAlign: "center",
          }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{dietPlans.length}</div>
            <div>Diet Plans</div>
          </div>
          <div style={{
            background: "#DBEAFE", color: "#1E3A8A",
            padding: "8px 14px", borderRadius: 12,
            fontSize: 12, fontWeight: 700, textAlign: "center",
          }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{exercisePlans.length}</div>
            <div>Exercise Plans</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 24,
        background: T.surface, borderRadius: 14, padding: 5,
        border: `1px solid ${T.border}`, width: "fit-content",
      }}>
        {[
          { key: "all",      label: "📋 All Plans",      count: allPlans.length },
          { key: "diet",     label: "🥗 Diet Plans",     count: dietPlans.length },
          { key: "exercise", label: "🏃 Exercise Plans", count: exercisePlans.length },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setTab(f.key)}
            style={{
              padding: "9px 18px", borderRadius: 10, border: "none",
              cursor: "pointer", fontSize: 12.5, fontFamily: "inherit",
              background: tab === f.key
                ? (f.key === "diet" ? "#059669" : f.key === "exercise" ? "#2563EB" : T.blue)
                : "transparent",
              color: tab === f.key ? "#fff" : T.muted,
              fontWeight: tab === f.key ? 700 : 500,
              transition: "all .2s",
            }}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Plans List */}
      {filteredPlans.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: T.surface, borderRadius: 20,
          boxShadow: T.sh1, border: `1px solid ${T.border}`,
        }}>
          <div style={{ fontSize: 56, marginBottom: 18 }}>
            {allPlans.length === 0 ? "💊" : "🔍"}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 8 }}>
            {allPlans.length === 0
              ? "No Health Plans Yet"
              : "No plans in this category"
            }
          </div>
          <div style={{ fontSize: 13, color: T.muted, maxWidth: 350, margin: "0 auto", lineHeight: 1.6 }}>
            {allPlans.length === 0
              ? "When your doctor prescribes a diet or exercise plan, it will appear here. Book an appointment and ask your doctor for personalized health recommendations."
              : "Try selecting a different filter above."
            }
          </div>
        </div>
      ) : (
        <div>
          {filteredPlans.map((plan, i) => (
            <PlanCard key={`${plan._type}-${plan.patientEmail}-${i}`} plan={plan} type={plan._type} />
          ))}
        </div>
      )}
    </div>
  );
}
