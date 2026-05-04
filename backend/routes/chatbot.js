// filepath: backend/routes/chatbot.js
const express = require('express')
const router = express.Router()

// Health knowledge base
const HEALTH_KB = {
  bmi: {
    keywords: ['bmi', 'body mass index', 'weight'],
    response: '📊 **Body Mass Index (BMI)** is a measure of body fat based on height and weight.\n\n**Formula:** BMI = Weight(kg) / (Height(m))²\n\n**Categories:**\n• Underweight: BMI < 18.5\n• Normal: 18.5 - 24.9\n• Overweight: 25 - 29.9\n• Obese: BMI ≥ 30\n\n💡 Tip: Maintain a healthy BMI through balanced diet and regular exercise.'
  },
  bloodPressure: {
    keywords: ['blood pressure', 'bp', 'hypertension', 'control pressure'],
    response: '❤️ **Blood Pressure Control Tips:**\n\n✓ Reduce salt intake (< 5g/day)\n✓ Increase fruits & vegetables\n✓ Exercise 30 mins daily\n✓ Manage stress through yoga/meditation\n✓ Limit alcohol consumption\n✓ Maintain healthy weight\n✓ Get adequate sleep (7-8 hours)\n✓ Monitor BP regularly\n\n⚠️ Normal BP: < 120/80 mmHg\n🔴 Consult doctor if persistently > 140/90'
  },
  sleep: {
    keywords: ['sleep', 'insomnia', 'sleeping tips', 'better sleep'],
    response: '😴 **Tips for Better Sleep:**\n\n✓ Maintain consistent sleep schedule (10 PM - 6 AM)\n✓ Create dark, quiet bedroom\n✓ Avoid screens 1 hour before bed\n✓ Limit caffeine after 2 PM\n✓ Exercise daily (but not before bed)\n✓ Try relaxation techniques: meditation, deep breathing\n✓ Keep bedroom cool (16-19°C)\n✓ Avoid heavy meals at night\n\n💤 Target: 7-9 hours per night'
  },
  cholesterol: {
    keywords: ['cholesterol', 'high cholesterol', 'reduce cholesterol'],
    response: '🥗 **Foods to Reduce Cholesterol:**\n\n✓ Oats & whole grains\n✓ Fish (salmon, mackerel) - Omega-3\n✓ Nuts (almonds, walnuts)\n✓ Olive oil\n✓ Beans & legumes\n✓ Fruits & vegetables\n✓ Low-fat dairy\n\n❌ Avoid:\n✗ Trans fats & fried foods\n✗ Saturated fats\n✗ Processed foods\n✗ Red meat (limit)\n\n💡 Exercise 30 mins daily + dietary changes = Better results'
  },
  diabetes: {
    keywords: ['diabetes', 'sugar', 'blood sugar', 'symptoms of diabetes'],
    response: '🩺 **Diabetes Symptoms & Prevention:**\n\n⚠️ Symptoms:\n• Increased thirst & urination\n• Fatigue & blurred vision\n• Slow wound healing\n• Numbness in feet/hands\n\n✅ Prevention:\n✓ Maintain healthy weight\n✓ Eat low-glycemic foods\n✓ Regular exercise (150 mins/week)\n✓ Control sugar/refined carbs\n✓ Manage stress\n✓ Get 7-8 hours sleep\n✓ Monitor blood sugar regularly\n\n📞 Consult doctor if symptoms persist'
  },
  immunity: {
    keywords: ['immunity', 'immune system', 'boost immunity', 'immunity food'],
    response: '🛡️ **Boost Your Immune System:**\n\n🥗 Foods:\n✓ Citrus fruits (Vitamin C)\n✓ Ginger & garlic\n✓ Yogurt & probiotics\n✓ Almonds & sunflower seeds\n✓ Green tea\n✓ Turmeric\n✓ Red bell peppers\n\n💪 Habits:\n✓ Sleep 7-9 hours daily\n✓ Exercise 30 mins daily\n✓ Manage stress\n✓ Hydrate (8-10 glasses water)\n✓ Hand hygiene\n✓ Avoid smoking\n\n⏱️ Consistency is key! Build these habits gradually.'
  },
  exercise: {
    keywords: ['exercise', 'workout', 'back pain exercise', 'fitness', 'exercise for pain'],
    response: '🏃 **Exercise Guide:**\n\n📋 General Recommendation:\n• 150 minutes moderate cardio/week\n• 2 days strength training\n• Flexibility exercises (yoga/stretching)\n\n🏥 For Back Pain:\n✓ Core strengthening (planks, bridges)\n✓ Gentle yoga\n✓ Swimming\n✓ Walking\n❌ Avoid heavy weights initially\n\n💡 Tips:\n✓ Warm up 5-10 mins before exercise\n✓ Start slow & gradually increase\n✓ Listen to your body\n✓ Consult physiotherapist for pain relief\n\n⚠️ Stop if sharp pain occurs'
  },
  water: {
    keywords: ['water', 'hydration', 'drink water', 'how much water'],
    response: '💧 **Hydration Guide:**\n\n📊 Daily Water Intake:\n• Adults: 8-10 glasses (2-3 liters)\n• Athletes: Add 500ml per 30 mins exercise\n• Hot climate: Increase intake\n\n💡 Benefits:\n✓ Maintains body temperature\n✓ Aids digestion\n✓ Improves skin health\n✓ Boosts energy & focus\n✓ Supports kidney function\n\n⏰ When to Drink:\n✓ Morning: 1 glass on waking\n✓ Before meals: 30 mins before\n✓ During exercise: Every 15-20 mins\n✓ Evening: Stop 2 hours before bed\n\n🍎 Tip: Add lemon/lime for flavor & extra Vitamin C'
  },
  nutrition: {
    keywords: ['nutrition', 'diet', 'healthy diet', 'eating tips', 'balanced diet'],
    response: '🥗 **Balanced Diet Guide:**\n\n🍎 Daily Requirements:\n• Fruits: 2-3 servings\n• Vegetables: 3-4 servings\n• Whole grains: 5-7 servings\n• Protein: 5-6 servings\n• Dairy: 2-3 servings\n• Fats: 2-3 servings (healthy oils)\n\n🥕 Healthy Choices:\n✓ Vegetables: Broccoli, spinach, carrots\n✓ Fruits: Apples, bananas, berries\n✓ Proteins: Chicken, fish, legumes, tofu\n✓ Grains: Brown rice, whole wheat\n✓ Dairy: Low-fat yogurt, milk\n\n❌ Limit:\n✗ Processed foods\n✗ Sugary drinks\n✗ High-salt foods\n✗ Trans fats\n\n⚡ Meal timing: Breakfast > Lunch > Dinner'
  },
  stress: {
    keywords: ['stress', 'anxiety', 'mental health', 'depression', 'meditation'],
    response: '🧠 **Manage Stress & Anxiety:**\n\n🧘 Relaxation Techniques:\n✓ Deep breathing (4-4-8 technique)\n✓ Meditation (10-20 mins daily)\n✓ Yoga (reduces cortisol)\n✓ Progressive muscle relaxation\n✓ Mindfulness exercises\n\n💪 Lifestyle Changes:\n✓ Regular exercise\n✓ Adequate sleep (7-9 hours)\n✓ Social connections\n✓ Time in nature\n✓ Hobbies & interests\n✓ Journaling\n\n🎵 Relaxation:\n✓ Listen to calm music\n✓ Aromatherapy\n✓ Warm bath\n✓ Reading\n\n📞 Professional Help:\n⚠️ If symptoms persist, consult a therapist'
  }
}

// Function to find best response
function findResponse(message) {
  const lowerMsg = message.toLowerCase()
  
  // Check each knowledge base entry
  for (const [key, data] of Object.entries(HEALTH_KB)) {
    if (data.keywords.some(keyword => lowerMsg.includes(keyword))) {
      return data.response
    }
  }
  
  // Default response if no match found
  return generateDefaultResponse(message)
}

function generateDefaultResponse(message) {
  const responses = [
    "🏥 That's a great health question! Here are some general tips:\n\n✓ Consult with your doctor for personalized advice\n✓ Maintain regular exercise & balanced diet\n✓ Get adequate sleep (7-8 hours)\n✓ Stay hydrated\n✓ Manage stress through meditation\n✓ Regular health checkups\n\n💡 For specific concerns, I recommend seeing a healthcare professional.",
    
    "💪 Here's what I can suggest:\n\n✓ Consistency is key - build healthy habits gradually\n✓ Prevention is better than cure\n✓ Listen to your body\n✓ Don't skip meals\n✓ Stay active daily\n✓ Manage stress effectively\n\n📞 For detailed medical advice, please consult Dr. on our platform!",
    
    "🩺 Health tips based on your question:\n\n✓ Eat nutrient-rich foods\n✓ Stay hydrated throughout the day\n✓ Regular physical activity (30 mins)\n✓ Quality sleep is crucial\n✓ Avoid smoking & excessive alcohol\n✓ Regular health checkups\n\n💡 Consider booking an appointment with one of our specialists!"
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

// Chatbot endpoint
router.post('/', (req, res) => {
  try {
    const { message } = req.body
    
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message'
      })
    }
    
    const response = findResponse(message)
    
    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Chatbot error:', error)
    res.status(500).json({
      success: false,
      error: 'An error occurred while processing your request'
    })
  }
})

module.exports = router
