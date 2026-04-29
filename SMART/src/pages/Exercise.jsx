import React, { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'

const PDF_GUIDESS = [
  {
    title: "Beginner Workout Guide",
    icon: "📄",
    color: "#16a34a",
    link: "/assets/Full-Body-12-Week-Workout-Routine.pdf"
  },
  {
    title: "Intermediate Training",
    icon: "📘",
    color: "#f59e0b",
    link: "/assets/Bodybuilding-Workout-Plan-for-Intermediates.pdf"
  },
  {
    title: "Advanced Strength",
    icon: "📕",
    color: "#ef4444",
    link: "/assets/advancedstrengthbuildingworkout.pdf"
  },
  {
    title: "HIIT Cardio Guide",
    icon: "🔥",
    color: "#06b6d4",
    link: "/assets/3-Day-HIIT-Workout-Plan-PDF.pdf"
  },
  {
    title: "Stretching & Recovery",
    icon: "🧘",
    color: "#8b5cf6",
    link: "/assets/wellness-mindfulstretchingguide.pdf"
  },
  {
    title: "Nutrition for Athletes",
    icon: "🥗",
    color: "#14b8a6",
    link: "/assets/The Complete Guide To Sports Nutrition PDF.pdf"
  },
  {
    title: "Injury Prevention",
    icon: "🏥",
    color: "#ec4899",
    link: "/assets/knee-injury-prevention-exercises-to-keep-you-from-getting-sidelined.pdf"
  },
  {
    title: "Progress Tracking Log",
    icon: "📊",
    color: "#3b82f6",
    link: "/assets/Fitness-Tracker-Template-Blank-Fitness-Tracker-Template.pdf"
  }
]

const LEVELS = [
  {
    id: 'beginner',
    name: 'Beginner',
    icon: '🌱',
    tag: 'Start Here',
    tagColor: '#16a34a',
    goal: '3 days/week · 20–30 min',
    desc: 'Perfect for those just starting out. Low intensity, gentle on joints, builds the exercise habit.',
    days: [
      { day: 'Monday', exercises: [{ name: 'Brisk Walking', sets: '1 set', reps: '20 minutes', cal: '~120 kcal' }, { name: 'Bodyweight Squats', sets: '3 sets', reps: '10 reps', cal: '~40 kcal' }, { name: 'Wall Push-Ups', sets: '3 sets', reps: '8 reps', cal: '~25 kcal' }] },
      { day: 'Wednesday', exercises: [{ name: 'Cycling (light)', sets: '1 set', reps: '25 minutes', cal: '~150 kcal' }, { name: 'Standing Calf Raises', sets: '3 sets', reps: '12 reps', cal: '~20 kcal' }, { name: 'Seated Leg Raises', sets: '2 sets', reps: '10 reps', cal: '~15 kcal' }] },
      { day: 'Friday', exercises: [{ name: 'Yoga / Stretching', sets: '1 set', reps: '30 minutes', cal: '~90 kcal' }, { name: 'Light Dumbbell Curls', sets: '2 sets', reps: '10 reps', cal: '~30 kcal' }, { name: 'Plank Hold', sets: '3 sets', reps: '20 seconds', cal: '~15 kcal' }] },
    ],
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    icon: '🔥',
    tag: 'Most Popular',
    tagColor: '#f59e0b',
    goal: '4 days/week · 40–50 min',
    desc: 'A balanced mix of strength and cardio. Builds endurance, burns fat, and tones muscles effectively.',
    days: [
      { day: 'Monday — Strength', exercises: [{ name: 'Push-Ups', sets: '4 sets', reps: '15 reps', cal: '~60 kcal' }, { name: 'Dumbbell Rows', sets: '3 sets', reps: '12 reps', cal: '~50 kcal' }, { name: 'Lunges', sets: '3 sets', reps: '12 each leg', cal: '~70 kcal' }, { name: 'Plank', sets: '3 sets', reps: '45 seconds', cal: '~25 kcal' }] },
      { day: 'Tuesday — Cardio', exercises: [{ name: 'Running / Jogging', sets: '1 set', reps: '30 minutes', cal: '~280 kcal' }, { name: 'Jump Rope', sets: '3 sets', reps: '2 minutes', cal: '~80 kcal' }] },
      { day: 'Thursday — Upper Body', exercises: [{ name: 'Dumbbell Press', sets: '4 sets', reps: '12 reps', cal: '~55 kcal' }, { name: 'Tricep Dips', sets: '3 sets', reps: '12 reps', cal: '~40 kcal' }, { name: 'Shoulder Press', sets: '3 sets', reps: '10 reps', cal: '~45 kcal' }] },
      { day: 'Saturday — Lower Body + Core', exercises: [{ name: 'Barbell Squats', sets: '4 sets', reps: '10 reps', cal: '~90 kcal' }, { name: 'Deadlifts', sets: '3 sets', reps: '8 reps', cal: '~80 kcal' }, { name: 'Bicycle Crunches', sets: '3 sets', reps: '20 reps', cal: '~30 kcal' }] },
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    icon: '💪',
    tag: 'High Performance',
    tagColor: '#ef4444',
    goal: '5 days/week · 60–75 min',
    desc: 'For seasoned athletes. High-intensity workouts to maximise strength, power, and cardiovascular fitness.',
    days: [
      { day: 'Monday — Chest & Triceps', exercises: [{ name: 'Bench Press', sets: '5 sets', reps: '8 reps', cal: '~110 kcal' }, { name: 'Incline Dumbbell Press', sets: '4 sets', reps: '10 reps', cal: '~90 kcal' }, { name: 'Cable Flyes', sets: '3 sets', reps: '12 reps', cal: '~50 kcal' }, { name: 'Skull Crushers', sets: '4 sets', reps: '10 reps', cal: '~60 kcal' }] },
      { day: 'Tuesday — Back & Biceps', exercises: [{ name: 'Pull-Ups', sets: '4 sets', reps: '10 reps', cal: '~80 kcal' }, { name: 'Barbell Rows', sets: '4 sets', reps: '8 reps', cal: '~100 kcal' }, { name: 'Lat Pulldowns', sets: '3 sets', reps: '12 reps', cal: '~60 kcal' }, { name: 'Hammer Curls', sets: '3 sets', reps: '12 reps', cal: '~40 kcal' }] },
      { day: 'Wednesday — HIIT Cardio', exercises: [{ name: 'Burpees', sets: '4 sets', reps: '15 reps', cal: '~120 kcal' }, { name: 'Box Jumps', sets: '4 sets', reps: '12 reps', cal: '~100 kcal' }, { name: 'Sprint Intervals', sets: '6 sets', reps: '30 sec on / 30 sec off', cal: '~200 kcal' }] },
      { day: 'Thursday — Legs', exercises: [{ name: 'Back Squats', sets: '5 sets', reps: '6 reps', cal: '~130 kcal' }, { name: 'Romanian Deadlifts', sets: '4 sets', reps: '8 reps', cal: '~110 kcal' }, { name: 'Leg Press', sets: '4 sets', reps: '10 reps', cal: '~90 kcal' }, { name: 'Calf Raises', sets: '4 sets', reps: '20 reps', cal: '~35 kcal' }] },
      { day: 'Friday — Shoulders & Core', exercises: [{ name: 'Military Press', sets: '4 sets', reps: '8 reps', cal: '~80 kcal' }, { name: 'Lateral Raises', sets: '4 sets', reps: '12 reps', cal: '~40 kcal' }, { name: 'Hanging Leg Raises', sets: '4 sets', reps: '15 reps', cal: '~50 kcal' }, { name: 'Cable Woodchops', sets: '3 sets', reps: '12 each side', cal: '~40 kcal' }] },
    ],
  },
]

export default function Exercise() {
  const { user, getRecommendations } = useAuth()
  const [recommendation, setRecommendation] = useState(null)
  const [active, setActive] = useState('intermediate')
  const [openDay, setOpenDay] = useState(0)

  useEffect(() => {
    if (user) {
      const rec = getRecommendations('exercise', user.email)
      if (rec) setRecommendation(rec)
    }
  }, [user, getRecommendations])
  const plan = LEVELS.find(l => l.id === active)

  const openPdf = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="ex-page">
      <div className="ex-page-header">
        <h2 className="ex-page-title">💪 Exercise Plans</h2>
        <p className="ex-page-sub">Choose your fitness level and follow a structured workout programme designed by health experts</p>
      </div>

      {recommendation && (
        <div className="fade-up" style={{ marginBottom: '3.5rem' }}>
          <div className="dp-box" style={{ 
            background: 'linear-gradient(135deg, #16a34a, #059669)', 
            color: 'white', padding: '35px', borderRadius: '35px', border: 'none',
            boxShadow: '0 20px 45px rgba(22, 163, 74, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '22px' }}>
              <div>
                <h3 style={{ fontSize: '25px', fontWeight: '800', marginBottom: '4px' }}>💪 Doctor's Prescribed Routine</h3>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Customised workout programme by Dr. {recommendation.doctorName}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 18px', borderRadius: '99px', fontSize: '12px', fontWeight: '700' }}>
                Updated: {new Date(recommendation.date).toLocaleDateString()}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {[
                { label: 'Morning Session', icon: '🌅', text: recommendation.data.morning },
                { label: 'Afternoon Session', icon: '☀️', text: recommendation.data.afternoon },
                { label: 'Evening Session', icon: '🌙', text: recommendation.data.evening },
              ].map((s, i) => s.text && (
                <div key={i} style={{ background: 'rgba(255,255,255,0.12)', padding: '24px', borderRadius: '28px', backdropFilter: 'blur(12px)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>{s.icon}</div>
                  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '8px', opacity: 0.9 }}>{s.label}</div>
                  <div style={{ fontSize: '13.5px', lineHeight: '1.6' }}>{s.text}</div>
                </div>
              ))}
            </div>

            {recommendation.data.tips && (
              <div style={{ marginTop: '28px', background: 'rgba(255,255,255,0.18)', padding: '24px', borderRadius: '24px' }}>
                <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '10px' }}>💡 Instructor Tips & Precautions:</div>
                <div style={{ fontSize: '14px', lineHeight: '1.7' }}>{recommendation.data.tips}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="ex-levels-wrapper">
        <div className="ex-levels">
          {LEVELS.map((l, idx) => (
            <button 
              key={l.id} 
              className={`ex-level-card ${active === l.id ? 'active' : ''}`} 
              onClick={() => { setActive(l.id); setOpenDay(0) }}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="elc-icon">{l.icon}</div>
              <div className="elc-name">{l.name}</div>
              <div className="elc-goal">{l.goal}</div>
              <span className="elc-tag" style={{ background: l.tagColor + '20', color: l.tagColor }}>{l.tag}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ex-detail">
        <div className="dp-box ex-info">
          <div className="exi-top">
            <span className="exi-icon">{plan.icon}</span>
            <div>
              <div className="exi-name">{plan.name} Programme</div>
              <div className="exi-goal">{plan.goal}</div>
            </div>
            <span className="exi-tag" style={{ background: plan.tagColor + '20', color: plan.tagColor }}>{plan.tag}</span>
          </div>
          <p className="exi-desc">{plan.desc}</p>
          <div className="exi-stats">
            <div className="exi-stat">
              <div className="eis-circle">
                <span className="eis-val">{plan.days.length}</span>
              </div>
              <span className="eis-label">Days / Week</span>
            </div>
            <div className="exi-stat">
              <div className="eis-circle">
                <span className="eis-val">{plan.days.reduce((a, d) => a + d.exercises.length, 0)}</span>
              </div>
              <span className="eis-label">Total Exercises</span>
            </div>
            <div className="exi-stat">
              <div className="eis-circle">
                <span className="eis-val">🔥</span>
              </div>
              <span className="eis-label">Fat Burn</span>
            </div>
          </div>
        </div>

        <div className="ex-days">
          {plan.days.map((d, i) => (
            <div className={`ex-day dp-box ${openDay === i ? 'open' : ''}`} key={i}>
              <button className="ex-day-header" onClick={() => setOpenDay(openDay === i ? -1 : i)}>
                <div className="exd-left">
                  <span className="ex-day-num">{i + 1}</span>
                  <div>
                    <span className="ex-day-name">{d.day}</span>
                    <span className="ex-day-count">{d.exercises.length} exercises</span>
                  </div>
                </div>
                <span className="ex-day-chevron">{openDay === i ? '▲' : '▼'}</span>
              </button>
              {openDay === i && (
                <div className="ex-exercises">
                  <div className="ex-ex-head">
                    <span>Exercise</span><span>Sets</span><span>Reps / Time</span><span>Calories</span>
                  </div>
                  {d.exercises.map((ex, j) => (
                    <div className="ex-ex-row" key={j}>
                      <span className="ex-ex-name">
                        <span className="ex-ex-bullet" style={{ background: plan.tagColor }} />
                        {ex.name}
                      </span>
                      <span>{ex.sets}</span>
                      <span>{ex.reps}</span>
                      <span className="ex-ex-cal">{ex.cal}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="dp-box ex-tips-box">
        <div className="dp-box-head"><span className="dp-box-title">🏋️ General Fitness Tips</span></div>
        <div className="ex-tips-grid">
          {[
            { icon: '💧', tip: 'Drink 500 ml of water 30 min before exercise.' },
            { icon: '🧘', tip: 'Warm up for 5–10 min before every session.' },
            { icon: '😴', tip: 'Rest is as important as training — sleep 7–9 hrs.' },
            { icon: '🥗', tip: 'Eat a protein-rich meal within 2 hrs post-workout.' },
            { icon: '📈', tip: 'Increase intensity gradually — 10% rule per week.' },
            { icon: '🩺', tip: 'Consult your doctor before starting intense exercise.' },
          ].map((t, i) => (
            <div className="ex-tip" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
              <span className="ex-tip-icon">{t.icon}</span>
              <span>{t.tip}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pdf-section">
        <div className="pdf-header">
          <h3 className="pdf-title">📚 Exercise & Fitness Guides</h3>
          <p className="pdf-subtitle">Download comprehensive PDFs to enhance your workout journey</p>
        </div>
        <div className="pdf-grid">
          {PDF_GUIDESS.map((guide, idx) => (
            <div
              key={idx}
              onClick={() => openPdf(guide.link)}
              className="pdf-card"
              style={{ '--pdf-color': guide.color, animationDelay: `${idx * 0.08}s` }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openPdf(guide.link)}
            >
              <div className="pdf-icon-circle">{guide.icon}</div>
              <div className="pdf-card-content">
                <h4 className="pdf-card-title">{guide.title}</h4>
                <div className="pdf-card-footer">
                  <span className="pdf-download">📥 Download</span>
                  <span className="pdf-arrow">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        * {
          scroll-behavior: smooth;
        }

        .ex-page {
          max-width: 1600px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #eef2ff 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .ex-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(46, 12, 237, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(16, 102, 239, 0.08) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .ex-page > * {
          position: relative;
          z-index: 1;
        }

        .ex-page-header {
          text-align: center;
          margin-bottom: 3.5rem;
          animation: slideDown 0.8s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ex-page-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #16a34a 0%, #f59e0b 50%, #ef4444 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 0.75rem;
          letter-spacing: -0.8px;
        }

        .ex-page-sub {
          color: #475569;
          font-size: 1.15rem;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        /* Level Selector */
        .ex-levels-wrapper {
          width: 100%;
          margin-bottom: 3.5rem;
        }

        .ex-levels {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.8rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .ex-level-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 28px;
          padding: 2.2rem 1.8rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          animation: slideUp 0.6s ease-out both;
          position: relative;
          overflow: hidden;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ex-level-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .ex-level-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border-color: #cbd5e1;
        }

        .ex-level-card.active {
          background: #eff6ff;
          border-color: #3b82f6;
          border-width: 4px;
          color: #1e40af;
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.2);
        }

        .ex-level-card.active .elc-goal {
          color: #3b82f6;
        }

        .elc-icon {
        
          font-size: 3.5rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .elc-name {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .elc-goal {
          font-size: 0.9rem;
          font-weight: 600;
          opacity: 0.7;
        }

        .elc-tag {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        /* Detail Section */
        .ex-detail {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 2.2rem;
          margin-bottom: 3rem;
          animation: slideUp 0.8s ease-out 0.2s both;
        }

        .dp-box {
          background: white;
          border-radius: 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.6);
          transition: all 0.4s ease;
        }

        .dp-box:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          transform: translateY(-6px);
        }

        .ex-info {
          padding: 2.2rem;
        }

        .exi-top {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 1.8rem;
          padding-bottom: 1.8rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .exi-icon {
          font-size: 3.2rem;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .exi-name {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
        }

        .exi-goal {
          font-size: 0.9rem;
          color: #475569;
          font-weight: 600;
        }

        .exi-tag {
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-left: auto;
        }

        .exi-desc {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .exi-stats {
          display: flex;
          gap: 1.5rem;
          justify-content: space-between;
        }

        .exi-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          flex: 1;
        }

        .eis-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f1f5f9, #eef2ff);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .exi-stat:hover .eis-circle {
          transform: scale(1.15);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }

        .eis-val {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #16a34a, #f59e0b);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .eis-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        /* Workout Days */
        .ex-days {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .ex-day {
          padding: 0;
        }

        .ex-day-header {
          width: 100%;
          padding: 1.5rem 1.8rem;
          border: none;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          transition: all 0.3s ease;
          border-radius: 20px 20px 0 0;
        }

        .ex-day.open .ex-day-header {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-radius: 20px 20px 0 0;
        }

        .ex-day-header:hover {
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
        }

        .exd-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .ex-day-num {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #16a34a, #10b981);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.95rem;
        }

        .ex-day-name {
          font-weight: 800;
          font-size: 1.05rem;
          display: block;
        }

        .ex-day-count {
          font-size: 0.8rem;
          opacity: 0.7;
          font-weight: 500;
          display: block;
          margin-top: 0.2rem;
        }

        .ex-day-chevron {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .ex-day.open .ex-day-chevron {
          color: white;
        }

        .ex-exercises {
          padding: 1.8rem;
          background: white;
          border-radius: 0 0 20px 20px;
          animation: expandDown 0.4s ease-out;
        }

        @keyframes expandDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ex-ex-head {
          display: grid;
          grid-template-columns: 1.5fr 0.8fr 1fr 0.8fr;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
          font-weight: 700;
          font-size: 0.85rem;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1rem;
        }

        .ex-ex-row {
          display: grid;
          grid-template-columns: 1.5fr 0.8fr 1fr 0.8fr;
          gap: 1rem;
          padding: 1rem;
          margin-bottom: 0.8rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 14px;
          border-left: 4px solid #3b82f6;
          transition: all 0.3s ease;
          align-items: center;
        }

        .ex-ex-row:hover {
          background: linear-gradient(135deg, #f0f4ff, #eef2ff);
          transform: translateX(6px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.15);
        }

        .ex-ex-name {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-weight: 600;
          color: #0f172a;
        }

        .ex-ex-bullet {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .ex-ex-cal {
          font-weight: 700;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* Tips Section */
        .ex-tips-box {
          margin-bottom: 3rem;
          animation: slideUp 0.8s ease-out 0.3s both;
        }

        .dp-box-head {
          padding: 1.5rem 1.8rem;
          border-bottom: 2px solid #f1f5f9;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .dp-box-title {
          font-weight: 800;
          color: #0f172a;
          letter-spacing: 0.3px;
          font-size: 1.15rem;
        }

        .ex-tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
        }

        .ex-tip {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 18px;
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out backwards;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .ex-tip:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          background: linear-gradient(135deg, #f0f4ff, #eef2ff);
        }

        .ex-tip-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .ex-tip {
          color: #334155;
          font-size: 0.95rem;
          line-height: 1.6;
          font-weight: 500;
        }

        /* PDF Section */
        .pdf-section {
          margin-top: 4rem;
          padding: 3rem 0;
          animation: slideUp 0.8s ease-out 0.4s both;
        }

        .pdf-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .pdf-title {
          font-size: 2.2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .pdf-subtitle {
          font-size: 1rem;
          color: #475569;
          font-weight: 500;
        }

        .pdf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.8rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .pdf-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem 1.8rem;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          text-align: center;
          animation: slideUp 0.6s ease-out backwards;
          position: relative;
          overflow: hidden;
        }

        .pdf-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, var(--pdf-color), transparent);
          opacity: 0;
          transition: all 0.4s ease;
          pointer-events: none;
        }

        .pdf-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
          border-color: var(--pdf-color);
        }

        .pdf-card:hover::before {
          opacity: 0.1;
        }

        .pdf-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--pdf-color), rgba(0,0,0,0.05));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .pdf-card:hover .pdf-icon-circle {
          transform: scale(1.2) rotate(10deg);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }

        .pdf-card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }

        .pdf-card-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.3px;
        }

        .pdf-card-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: auto;
          font-weight: 700;
          color: var(--pdf-color);
          font-size: 0.9rem;
        }

        .pdf-download {
          opacity: 0.8;
        }

        .pdf-arrow {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .pdf-card:hover .pdf-arrow {
          transform: translateX(6px);
        }

        @media (max-width: 1000px) {
          .ex-detail {
            grid-template-columns: 1fr;
          }
          .ex-page-title {
            font-size: 2.2rem;
          }
          .ex-levels {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .pdf-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .ex-page {
            padding: 1.5rem 1rem;
          }
          .ex-page-title {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 480px) {
          .pdf-grid {
            grid-template-columns: 1fr;
          }
          .ex-ex-head {
            grid-template-columns: 1fr;
            display: none;
          }
          .ex-ex-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}