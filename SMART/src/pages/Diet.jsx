import React, { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'

const PLANS = {
  veg: [
    {
      id: 'balanced-veg',
      name: 'Balanced Diet',
      tag: 'Recommended',
      tagColor: '#3b82f6',
      calories: '1800–2200 kcal',
      desc: 'A well-rounded plant-forward plan covering all major food groups. Ideal for general health maintenance.',
      icon: '🥗',
      meals: [
        { time: '7:00 AM - Breakfast', items: ['Oatmeal with berries and nuts', 'Low-fat milk or yogurt', 'One banana'] },
        { time: '10:30 AM - Mid-Morning', items: ['Handful of mixed nuts', 'One apple or orange'] },
        { time: '1:00 PM - Lunch', items: ['Brown rice or whole-wheat roti', 'Dal / lentil curry', 'Steamed vegetables', 'Low-fat curd'] },
        { time: '4:30 PM - Evening Snack', items: ['Green tea', 'Roasted chana or sprouts'] },
        { time: '7:30 PM - Dinner', items: ['Grilled paneer', 'Vegetable soup', 'Salad with olive oil dressing'] },
      ],
      macros: { carbs: 50, protein: 25, fat: 25 },
      tips: ['Eat at fixed times each day', 'Chew slowly — it aids digestion', 'Avoid screens during meals'],
    },
    {
      id: 'lowcarb-veg',
      name: 'Low-Carb Diet',
      tag: 'Weight Loss',
      tagColor: '#16a34a',
      calories: '1400–1700 kcal',
      desc: 'Vegetarian low-carb plan to promote fat burning. Great for weight loss and blood-sugar control.',
      icon: '🥑',
      meals: [
        { time: '7:00 AM - Breakfast', items: ['Scrambled tofu with spinach', 'Avocado slices', 'Black coffee or herbal tea'] },
        { time: '10:30 AM - Mid-Morning', items: ['Greek yogurt (unsweetened)', 'Handful of almonds'] },
        { time: '1:00 PM - Lunch', items: ['Plant-based protein (soy chunks / tofu)', 'Large salad with olive oil', 'Steamed broccoli'] },
        { time: '4:30 PM - Evening Snack', items: ['Roasted chickpeas', 'Cucumber or celery sticks'] },
        { time: '7:30 PM - Dinner', items: ['Baked tofu', 'Stir-fried vegetables (no sauce)', 'Cauliflower rice'] },
      ],
      macros: { carbs: 20, protein: 45, fat: 35 },
      tips: ['Keep carbs under 100 g/day', 'Stay hydrated', 'Monitor electrolytes'],
    },
    {
      id: 'heart-veg',
      name: 'Heart-Healthy Diet',
      tag: 'Cardio Care',
      tagColor: '#ef4444',
      calories: '1600–2000 kcal',
      desc: 'Low in saturated fat and sodium. Designed to reduce cholesterol and protect cardiovascular health.',
      icon: '❤️',
      meals: [
        { time: '7:00 AM - Breakfast', items: ['Whole-grain toast with avocado', 'Fresh orange juice', 'Green tea'] },
        { time: '10:30 AM - Mid-Morning', items: ['Walnuts (5–6)', 'Seasonal fruit'] },
        { time: '1:00 PM - Lunch', items: ['Quinoa or millet', 'Chickpea curry', 'Steamed greens', 'Lemon water'] },
        { time: '4:30 PM - Evening Snack', items: ['Carrot and hummus', 'Herbal tea'] },
        { time: '7:30 PM - Dinner', items: ['Mushroom steak', 'Vegetable minestrone soup', 'Mixed salad'] },
      ],
      macros: { carbs: 55, protein: 25, fat: 20 },
      tips: ['Limit sodium to < 2300 mg/day', 'Choose unsaturated fats', 'Eat nuts and seeds daily'],
    },
    {
      id: 'diabetic-veg',
      name: 'Diabetic-Friendly Diet',
      tag: 'Blood Sugar',
      tagColor: '#f59e0b',
      calories: '1500–1800 kcal',
      desc: 'Controls glycaemic load to manage blood-sugar spikes.',
      icon: '🩺',
      meals: [
        { time: '7:00 AM - Breakfast', items: ['Vegetable upma', 'Unsweetened green tea', 'One small guava'] },
        { time: '10:30 AM - Mid-Morning', items: ['Buttermilk (low-fat)', 'A few walnuts'] },
        { time: '1:00 PM - Lunch', items: ['Brown rice (small portion) or 2 jowar rotis', 'Bitter gourd sabzi', 'Dal', 'Low-fat curd'] },
        { time: '4:30 PM - Evening Snack', items: ['Roasted seeds mix', 'Herbal tea (no sugar)'] },
        { time: '7:30 PM - Dinner', items: ['Grilled paneer', 'Methi sabzi', 'Clear vegetable soup'] },
      ],
      macros: { carbs: 45, protein: 30, fat: 25 },
      tips: ['Avoid sugary drinks', 'Eat every 3 hours to stabilise glucose', 'Track carb portions carefully'],
    },
  ],
  nonveg: [
    {
      id: 'balanced-nonveg',
      name: 'Balanced Diet',
      tag: 'Recommended',
      tagColor: '#3b82f6',
      calories: '1800–2200 kcal',
      desc: 'A well-rounded plan including lean meats and eggs. Ideal for general health maintenance.',
      icon: '🍗',
      meals: [
        { time: '7:00 AM - Breakfast', items: ['Omelette with whole-grain toast', 'Low-fat milk', 'One banana'] },
        { time: '10:30 AM - Mid-Morning', items: ['Handful of mixed nuts', 'Protein shake (optional)'] },
        { time: '1:00 PM - Lunch', items: ['Brown rice or whole-wheat roti', 'Grilled chicken curry', 'Steamed vegetables', 'Low-fat curd'] },
        { time: '4:30 PM - Evening Snack', items: ['Green tea', 'Boiled egg'] },
        { time: '7:30 PM - Dinner', items: ['Lean turkey', 'Vegetable soup', 'Salad with olive oil dressing'] },
      ],
      macros: { carbs: 45, protein: 30, fat: 25 },
      tips: ['Eat at fixed times each day', 'Chew slowly — it aids digestion', 'Avoid screens during meals'],
    },
    {
      id: 'lowcarb-nonveg',
      name: 'Low-Carb Diet',
      tag: 'Weight Loss',
      tagColor: '#16a34a',
      calories: '1400–1700 kcal',
      desc: 'High-protein, low-carb plan to promote fat burning. Great for weight loss and blood-sugar control.',
      icon: '🥩',
      meals: [
        { time: '7:00 AM - Breakfast', items: ['Scrambled eggs with spinach', 'Avocado slices', 'Black coffee'] },
        { time: '10:30 AM - Mid-Morning', items: ['Greek yogurt', 'Handful of almonds'] },
        { time: '1:00 PM - Lunch', items: ['Grilled chicken / fish', 'Large salad with olive oil', 'Steamed broccoli'] },
        { time: '4:30 PM - Evening Snack', items: ['Boiled eggs (2)', 'Cucumber sticks'] },
        { time: '7:30 PM - Dinner', items: ['Baked salmon', 'Stir-fried vegetables', 'Cauliflower rice'] },
      ],
      macros: { carbs: 20, protein: 45, fat: 35 },
      tips: ['Keep carbs under 100 g/day', 'Stay hydrated', 'Monitor electrolytes'],
    },
    {
      id: 'heart-nonveg',
      name: 'Heart-Healthy Diet',
      tag: 'Cardio Care',
      tagColor: '#ef4444',
      calories: '1600–2000 kcal',
      desc: 'Low in saturated fat. Includes lean poultry and fish for omega-3s.',
      icon: '❤️',
      meals: [
        { time: '7:00 AM - Breakfast', items: ['Whole-grain toast with avocado', 'Fresh orange juice', 'Green tea'] },
        { time: '10:30 AM - Mid-Morning', items: ['Walnuts (5–6)', 'Seasonal fruit'] },
        { time: '1:00 PM - Lunch', items: ['Quinoa', 'Baked fish', 'Steamed greens', 'Lemon water'] },
        { time: '4:30 PM - Evening Snack', items: ['Carrot and hummus', 'Herbal tea'] },
        { time: '7:30 PM - Dinner', items: ['Grilled turkey', 'Vegetable soup', 'Mixed salad'] },
      ],
      macros: { carbs: 50, protein: 30, fat: 20 },
      tips: ['Limit sodium', 'Choose unsaturated fats', 'Eat oily fish twice a week'],
    },
    {
      id: 'diabetic-nonveg',
      name: 'Diabetic-Friendly Diet',
      tag: 'Blood Sugar',
      tagColor: '#f59e0b',
      calories: '1500–1800 kcal',
      desc: 'Controls glycaemic load with lean protein sources.',
      icon: '🩺',
      meals: [
        { time: '7:00 AM - Breakfast', items: ['Vegetable omelette', 'Unsweetened green tea', 'One small guava'] },
        { time: '10:30 AM - Mid-Morning', items: ['Buttermilk', 'A few walnuts'] },
        { time: '1:00 PM - Lunch', items: ['Brown rice', 'Grilled chicken curry', 'Dal', 'Low-fat curd'] },
        { time: '4:30 PM - Evening Snack', items: ['Roasted seeds', 'Herbal tea'] },
        { time: '7:30 PM - Dinner', items: ['Grilled chicken', 'Methi sabzi', 'Clear soup'] },
      ],
      macros: { carbs: 40, protein: 35, fat: 25 },
      tips: ['Avoid sugary drinks', 'Eat every 3 hours', 'Track carb portions'],
    },
  ],
}

export default function Diet() {
  const { user, getRecommendations } = useAuth()
  const [recommendation, setRecommendation] = useState(null)
  const [dietType, setDietType] = useState('veg')
  const [activePlanId, setActivePlanId] = useState('balanced-veg')

  useEffect(() => {
    if (user) {
      const rec = getRecommendations('diet', user.email)
      if (rec) setRecommendation(rec)
    }
  }, [user, getRecommendations])

  const currentPlans = PLANS[dietType]
  const plan = currentPlans.find(p => p.id === activePlanId) || currentPlans[0]

  const downloadPlan = () => {
    try {
      const el = document.getElementById('dietExport')
      if (!el) return
      const html = `
        <html>
          <head>
            <title>${plan.name} (${dietType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}) — Diet Plan</title>
            <meta charset="utf-8" />
            <style>body{font-family:system-ui;margin:20px;color:#0f172a}</style>
          </head>
          <body>${el.innerHTML}</body>
        </html>
      `
      const w = window.open('', '_blank')
      if (!w) return
      w.document.write(html)
      w.document.close()
      w.focus()
      setTimeout(() => w.print(), 500)
    } catch (err) {
      alert('Unable to export. Use browser print.')
    }
  }

  const handleDietTypeChange = (type) => {
    setDietType(type)
    const firstPlanId = PLANS[type][0].id
    setActivePlanId(firstPlanId)
  }

  return (
    <div className="dp-page">
      <div className="dp-page-header">
        <h2 className="dp-page-title">🍽️ Personalised Diet Plans</h2>
        <p className="dp-page-sub">Choose your preferred diet type and plan that fits your health goals</p>
      </div>

      {recommendation && (
        <div className="fade-up" style={{ marginBottom: '3rem' }}>
          <div className="dp-box" style={{ 
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', 
            color: 'white', padding: '32px', borderRadius: '32px', border: 'none',
            boxShadow: '0 20px 40px rgba(14, 165, 233, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>👨‍⚕️ Doctor's Recommended Plan</h3>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Specifically designed for you by Dr. {recommendation.doctorName}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: '700' }}>
                Updated: {new Date(recommendation.date).toLocaleDateString()}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {[
                { time: 'Breakfast', icon: '🍳', text: recommendation.data.breakfast },
                { time: 'Mid-Morning', icon: '🍎', text: recommendation.data.midMorning },
                { time: 'Lunch', icon: '🍛', text: recommendation.data.lunch },
                { time: 'Evening Snack', icon: '☕', text: recommendation.data.eveningSnack },
                { time: 'Dinner', icon: '🍲', text: recommendation.data.dinner },
              ].map((m, i) => m.text && (
                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '24px', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: '20px', marginBottom: '10px' }}>{m.icon}</div>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '6px', opacity: 0.9 }}>{m.time}</div>
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{m.text}</div>
                </div>
              ))}
            </div>

            {recommendation.data.tips && (
              <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '20px' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>💡 Expert Tips:</div>
                <div style={{ fontSize: '13px', lineHeight: '1.6' }}>{recommendation.data.tips}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="diet-type-toggle">
        <button 
          className={`toggle-btn ${dietType === 'veg' ? 'active-veg' : ''}`}
          onClick={() => handleDietTypeChange('veg')}
        >
          <span className="toggle-icon">🌱</span>
          <span>Vegetarian</span>
        </button>
        <button 
          className={`toggle-btn ${dietType === 'nonveg' ? 'active-nonveg' : ''}`}
          onClick={() => handleDietTypeChange('nonveg')}
        >
          <span className="toggle-icon">🍖</span>
          <span>Non-Vegetarian</span>
        </button>
      </div>

      <div className="diet-tabs-container">
        <div className="diet-tabs">
          {currentPlans.map(p => (
            <button 
              key={p.id} 
              className={`diet-tab ${activePlanId === p.id ? 'active' : ''}`} 
              onClick={() => setActivePlanId(p.id)}
            >
              <span className="dt-icon">{p.icon}</span>
              <div className="dt-content">
                <span className="dt-name">{p.name}</span>
                <span className="dt-tag" style={{ background: p.tagColor + '20', color: p.tagColor }}>{p.tag}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div id="dietExport" className="diet-detail">
        <div className="diet-meals dp-box">
          <div className="dm-header">
            <span className="dm-icon">{plan.icon}</span>
            <div>
              <div className="dm-name">{plan.name} <span className="diet-badge">{dietType === 'veg' ? '🌱 Veg' : '🍖 Non-Veg'}</span></div>
              <div className="dm-cal">{plan.calories} / day</div>
            </div>
            <span className="dm-tag" style={{ background: plan.tagColor + '20', color: plan.tagColor }}>{plan.tag}</span>
          </div>
          <p className="dm-desc">{plan.desc}</p>

          <div className="dm-meals">
            {plan.meals.map((m, i) => (
              <div className="dm-meal" key={i}>
                <div className="dm-meal-time">
                  <span className="time-icon">⏰</span> {m.time}
                </div>
                <ul className="dm-meal-items">
                  {m.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="diet-right">
          <div className="dp-box diet-macros">
            <div className="dp-box-head"><span className="dp-box-title">📊 Macronutrients</span></div>
            <div className="diet-macro-chart">
              <div className="dmc-ring" style={{
                background: `conic-gradient(#3b82f6 0% ${plan.macros.carbs}%, #16a34a ${plan.macros.carbs}% ${plan.macros.carbs + plan.macros.protein}%, #f59e0b ${plan.macros.carbs + plan.macros.protein}% 100%)`
              }}>
                <div className="dmc-inner" />
              </div>
              <div className="dmc-legend">
                {[
                  { label: 'Carbs', val: plan.macros.carbs, color: '#3b82f6' },
                  { label: 'Protein', val: plan.macros.protein, color: '#16a34a' },
                  { label: 'Fat', val: plan.macros.fat, color: '#f59e0b' },
                ].map((m, i) => (
                  <div className="dmc-item" key={i}>
                    <div className="dmc-dot" style={{ background: m.color }} />
                    <span className="dmc-label">{m.label}</span>
                    <span className="dmc-pct">{m.val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dp-box diet-tips">
            <div className="dp-box-head"><span className="dp-box-title">💡 Expert Tips</span></div>
            <div className="dp-box-body">
              {plan.tips.map((t, i) => (
                <div className="diet-tip" key={i}>
                  <span className="diet-tip-num">{i + 1}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="resources-card">
            <div className="resources-header">
              <span className="resources-icon">📚</span>
              <span className="resources-title">Wellness Resources</span>
              <span className="resources-badge">Free</span>
            </div>

            <div className="resources-links">
              <a 
                href="/assets/Diet Plan Weight Loss.pdf"
                target="_blank"
                className="resource-link"
              >
                Weight Loss (Veg)
              </a>

              <a 
                href="/assets/weight_loss_non_veg.pdf"
                target="_blank"
                className="resource-link"
              >
                Weight Loss (Non-Veg)
              </a>

              <a 
                href="/assets/Diet Plan Weight Gain.pdf"
                target="_blank"
                className="resource-link"
              >
                Weight Gain (Veg)
              </a>

              <a 
                href="/assets/Diet Plan Weight Gain non veg.pdf"
                target="_blank"
                className="resource-link"
              >
                Weight Gain (Non-Veg)
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          scroll-behavior: smooth;
        }
        
        .dp-page {
          max-width: 1600px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #eef2ff 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        
        .dp-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        
        .dp-page > * {
          position: relative;
          z-index: 1;
        }
        
        .dp-page-header {
          text-align: center;
          margin-bottom: 3rem;
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
        
        .dp-page-title {
          font-size: 2.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #0ea5e9 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 0.75rem;
          letter-spacing: -0.5px;
        }
        
        .dp-page-sub {
          color: #475569;
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        /* Veg/Non-Veg Toggle */
        .diet-type-toggle {
          display: flex;
          justify-content: center;
          gap: 1.2rem;
          margin-bottom: 3.5rem;
          animation: slideUp 0.8s ease-out 0.1s both;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 2.2rem;
          font-size: 1rem;
          font-weight: 600;
          border: 2px solid transparent;
          border-radius: 60px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: white;
          color: #334155;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          position: relative;
          overflow: hidden;
        }
        
        .toggle-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.35s ease;
          z-index: -1;
        }
        
        .toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }
        
        .toggle-icon {
          font-size: 1.4rem;
          transition: transform 0.3s ease;
        }
        
        .toggle-btn:hover .toggle-icon {
          transform: scale(1.15);
        }
        
        .toggle-btn.active-veg {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          box-shadow: 0 12px 35px rgba(34,197,94,0.35);
          border-color: #22c55e;
        }
        
        .toggle-btn.active-nonveg {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 12px 35px rgba(239,68,68,0.35);
          border-color: #ef4444;
        }

        /* Diet Tabs Container & Grid */
        .diet-tabs-container {
          width: 100%;
          margin-bottom: 2.5rem;
          animation: slideUp 0.8s ease-out 0.2s both;
        }

        .diet-tabs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .diet-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          min-height: 180px;
        }
        
        .diet-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }
        
        .diet-tab:hover {
          transform: translateY(-6px);
          border-color: #cbd5e1;
          box-shadow: 0 12px 35px rgba(59,130,246,0.2);
        }
        
        .diet-tab:hover::before {
          left: 100%;
        }
        
        .diet-tab.active {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-color: #3b82f6;
          color: white;
          box-shadow: 0 15px 50px rgba(59,130,246,0.4);
        }
        
        .dt-icon {
          font-size: 2.5rem;
          transition: transform 0.3s ease;
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .diet-tab.active .dt-icon {
          animation: bounce 0.6s ease;
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        
        .dt-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
        }
        
        .dt-name {
          font-weight: 700;
          letter-spacing: 0.2px;
          font-size: 1.1rem;
          text-align: center;
        }
        
        .dt-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .diet-detail {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 2rem;
          animation: slideUp 0.8s ease-out 0.3s both;
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
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
          transform: translateY(-4px);
        }
        
        .diet-meals {
          padding: 2rem;
        }
        
        .dm-header {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f1f5f9;
        }
        
        .dm-icon {
          font-size: 3rem;
          animation: float 3s ease-in-out infinite;
        }
        
        .dm-name {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        
        .diet-badge {
          font-size: 0.75rem;
          background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          margin-left: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .dm-cal {
          font-size: 0.95rem;
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        
        .dm-tag {
          margin-left: auto;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.35rem 0.9rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .dm-desc {
          color: #475569;
          font-size: 0.95rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          line-height: 1.6;
          font-weight: 500;
        }
        
        .dm-meals {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        
        .dm-meal {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 18px;
          padding: 1rem 1.3rem;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(226, 232, 240, 0.6);
          position: relative;
          overflow: hidden;
        }
        
        .dm-meal::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: linear-gradient(180deg, #3b82f6, #16a34a);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .dm-meal:hover::before {
          opacity: 1;
        }
        
        .dm-meal:hover {
          transform: translateX(8px);
          box-shadow: 0 8px 20px rgba(59,130,246,0.15);
          background: linear-gradient(135deg, #f0f4ff 0%, #f1f5f9 100%);
        }
        
        .dm-meal-time {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.65rem;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 0.3px;
        }
        
        .time-icon {
          font-size: 1rem;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .dm-meal-items {
          margin: 0;
          padding-left: 0;
          color: #334155;
          font-size: 0.88rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 0;
          list-style: none;
        }
        
        .dm-meal-items li {
          margin: 0;
          padding-left: 0;
          position: relative;
          padding-left: 20px;
          font-weight: 500;
        }
        
        .dm-meal-items li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #16a34a;
          font-weight: 700;
        }
        
        .diet-right {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: slideUp 0.8s ease-out 0.4s both;
        }
        
        .dp-box-head {
          padding: 1.3rem 1.8rem;
          border-bottom: 2px solid #f1f5f9;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        
        .dp-box-title {
          font-weight: 800;
          color: #0f172a;
          letter-spacing: 0.3px;
          font-size: 1rem;
        }
        
        .dp-box-body {
          padding: 1.5rem 1.8rem;
        }
        
        .diet-macro-chart {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem 1.8rem;
          flex-wrap: wrap;
        }
        
        .dmc-ring {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          animation: spin 20s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .dmc-ring:hover {
          animation: spin 10s linear infinite;
        }
        
        .dmc-inner {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          box-shadow: inset 0 4px 10px rgba(0,0,0,0.05);
        }
        
        .dmc-legend {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          min-width: 150px;
        }
        
        .dmc-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          padding: 0.5rem 0;
        }
        
        .dmc-item:hover {
          transform: translateX(4px);
        }
        
        .dmc-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }
        
        .dmc-item:hover .dmc-dot {
          transform: scale(1.3);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        
        .dmc-label {
          flex: 1;
          color: #334155;
          font-weight: 600;
        }
        
        .dmc-pct {
          font-weight: 800;
          color: #0f172a;
          min-width: 35px;
          text-align: right;
          font-size: 1.05rem;
        }
        
        .diet-tips {
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
        }
        
        .diet-tip {
          display: flex;
          gap: 0.9rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #334155;
          transition: all 0.3s ease;
          padding: 0.5rem 0;
        }
        
        .diet-tip:last-child {
          margin-bottom: 0;
        }
        
        .diet-tip:hover {
          transform: translateX(4px);
        }
        
        .diet-tip-num {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        /* Attractive Resources Card */
        .resources-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 28px;
          padding: 2rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.12);
          position: relative;
          overflow: hidden;
        }
        
        .resources-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent);
          border-radius: 50%;
          pointer-events: none;
        }
        
        .resources-card::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 250px;
          height: 180px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.1), transparent);
          border-radius: 50%;
          pointer-events: none;
        }
        
        .resources-header {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          position: relative;
          z-index: 1;
        }
        
        .resources-icon {
          font-size: 2rem;
          animation: bounce-icon 2s ease-in-out infinite;
        }
        
        @keyframes bounce-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        
        .resources-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
          flex: 1;
          letter-spacing: 0.3px;
        }
        
        .resources-badge {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .resources-links {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          margin-bottom: 1.2rem;
          position: relative;
          z-index: 1;
        }
        
        .resource-link, .resource-btn {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          padding: 0.85rem 1.2rem;
          border-radius: 16px;
          text-decoration: none;
          color: #e2e8f0;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(255,255,255,0.1);
          width: 100%;
          cursor: pointer;
          text-align: left;
          position: relative;
          overflow: hidden;
        }
        
        .resource-link::before, .resource-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }
        
        .resource-link:hover, .resource-btn:hover {
          background: rgba(255,255,255,0.18);
          transform: translateX(6px);
          border-color: rgba(255,255,255,0.2);
          color: white;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
        }
        
        .resource-link:hover::before, .resource-btn:hover::before {
          left: 100%;
        }
        
        .link-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        
        .link-arrow {
          margin-left: auto;
          font-size: 1.1rem;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        
        .resource-link:hover .link-arrow, .resource-btn:hover .link-arrow {
          opacity: 1;
          transform: translateX(3px);
        }
        
        .resources-footer {
          margin-top: 1.2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          font-size: 0.75rem;
          color: #94a3b8;
          text-align: center;
          font-weight: 500;
          position: relative;
          z-index: 1;
          letter-spacing: 0.3px;
          line-height: 1.5;
        }

        @media (max-width: 1000px) {
          .diet-detail {
            grid-template-columns: 1fr;
          }
          .diet-tabs {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .diet-tabs {
            grid-template-columns: 1fr;
          }
          .diet-tab {
            min-height: 150px;
            padding: 1.5rem;
          }
          .dt-icon {
            font-size: 2rem;
          }
          .dt-name {
            font-size: 0.95rem;
          }
          .dp-page-title {
            font-size: 2rem;
          }
          .diet-tabs-container {
            margin-bottom: 2rem;
          }
        }
          /* ===== FINAL FIX ===== */

/* layout side → bottom */
.diet-detail {
  grid-template-columns: 1fr !important;
}

/* right section full width */
.diet-right {
  width: 100% !important;
}

/* resources card fix */
.resources-card {
  order: 3;
  width: 100%;
  max-width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%) !important;
}

/* text visible */
.resources-title,
.resource-link,
.resource-btn,
.resources-footer {
  color: white !important;
}

/* ===== END ===== */
      `}</style>
    </div>
  )
}