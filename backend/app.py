"""
Health Risk Prediction — Flask Backend
=======================================
Routes:
  POST /predict   — run disease-risk prediction
  GET  /model-info — return accuracy / metadata
  POST /chatbot   — health Q&A via Grok (with fallback)
  GET  /health    — liveness check
"""

import os, json, pickle, traceback
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

GROK_API_KEY = os.getenv("GROK_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# ────────────────────────────────────────────────
# App setup
# ────────────────────────────────────────────────
app = Flask(__name__, static_folder="../frontend/static",
            template_folder="../frontend")
CORS(app)   # allow all origins for local dev

# ────────────────────────────────────────────────
# Load model on startup
# ────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "health_risk_model.pkl")
META_PATH  = os.path.join(BASE_DIR, "model_meta.json")

model_pkg  = None
model_meta = {}

def load_model():
    global model_pkg, model_meta
    mp = os.path.abspath(MODEL_PATH)
    if not os.path.exists(mp):
        print(f"Warning: Model file not found at {mp}")
        print("   Run:  python model/train_model.py  first.")
        return
    with open(mp, "rb") as f:
        model_pkg = pickle.load(f)
    if os.path.exists(META_PATH):
        with open(os.path.abspath(META_PATH)) as f:
            model_meta = json.load(f)
    print(f"Model loaded - accuracy: {model_meta.get('accuracy', '?')}")

load_model()


# ────────────────────────────────────────────────
# Helper — calculate BMI from weight+height
# ────────────────────────────────────────────────
def calc_bmi(weight_kg: float, height_cm: float) -> float:
    height_m = height_cm / 100.0
    return round(weight_kg / (height_m ** 2), 2)


# ────────────────────────────────────────────────
# Helper — build feature vector (must match train_model.py)
# ────────────────────────────────────────────────
def to_bool(val):
    """Convert various inputs to 0 or 1"""
    if val is None:
        return 0
    if isinstance(val, str):
        return 1 if val.lower() in ("yes", "y", "1", "true", "on") else 0
    return int(val)

def build_features(data: dict) -> np.ndarray:
    import pandas as pd

    bmi = data["bmi"]

    # engineered features (mirror train_model.py)
    bmi_cat   = int(np.digitize(bmi, [18.5, 24.9, 29.9, 100]) - 1)
    bmi_cat   = min(bmi_cat, 3)
    pulse_p   = int(data["systolic_bp"]) - int(data["diastolic_bp"])
    act_score = int(data["daily_steps"]) / 1000.0
    sleep_q   = int(6 <= float(data["sleep_hours"]) <= 9)
    hypert    = int(int(data["systolic_bp"]) >= 130 or int(data["diastolic_bp"]) >= 80)
    high_chol = int(int(data["cholesterol"]) >= 200)
    risk_sc   = (to_bool(data["smoker"]) + to_bool(data["alcohol"]) +
                 to_bool(data["family_history"]) + hypert + high_chol)

    # encode gender
    gender_enc = 1 if str(data["gender"]).strip().lower() in ("male", "m", "1") else 0

    row = {
        "age"              : int(data["age"]),
        "gender"           : gender_enc,
        "bmi"              : bmi,
        "daily_steps"      : int(data["daily_steps"]),
        "sleep_hours"      : float(data["sleep_hours"]),
        "water_intake_l"   : float(data["water_intake_l"]),
        "calories_consumed": int(data["calories_consumed"]),
        "smoker"           : to_bool(data["smoker"]),
        "alcohol"          : to_bool(data["alcohol"]),
        "resting_hr"       : int(data["resting_hr"]),
        "systolic_bp"      : int(data["systolic_bp"]),
        "diastolic_bp"     : int(data["diastolic_bp"]),
        "cholesterol"      : int(data["cholesterol"]),
        "family_history"   : to_bool(data["family_history"]),
        "bmi_category"     : bmi_cat,
        "pulse_pressure"   : pulse_p,
        "activity_score"   : act_score,
        "sleep_quality"    : sleep_q,
        "hypertension"     : hypert,
        "high_cholesterol" : high_chol,
        "risk_score"       : risk_sc,
    }

    ordered_features = model_pkg["features"]
    return np.array([[row[f] for f in ordered_features]])


# ────────────────────────────────────────────────
# Risk interpretation helpers
# ────────────────────────────────────────────────
def risk_advice(prob: float, data: dict) -> dict:
    level = "LOW" if prob < 0.35 else ("MEDIUM" if prob < 0.65 else "HIGH")

    base_tips = [
        "Stay hydrated — aim for 2–3 L of water daily.",
        "Get 7–9 hours of quality sleep each night.",
        "Aim for 8,000–10,000 steps per day.",
        "Maintain a balanced, whole-food diet.",
        "Schedule regular check-ups with your doctor.",
    ]
    high_tips = [
        "⚠  Your risk score is elevated — consult a physician soon.",
        "Monitor blood pressure daily if possible.",
        "Limit alcohol and avoid smoking.",
        "Consider a lipid panel blood test.",
        "Follow up on family history with genetic counselling if advised.",
    ]
    tips = (high_tips + base_tips[:2]) if level == "HIGH" else base_tips

    diseases = []
    if int(data.get("cholesterol", 0)) >= 200 or int(data.get("systolic_bp", 0)) >= 130:
        diseases.append("Cardiovascular Disease")
    if float(data.get("bmi", 0)) >= 25:
        diseases.append("Type 2 Diabetes Risk")
    if to_bool(data.get("smoker", 0)):
        diseases.append("Respiratory Conditions")
    if not diseases:
        diseases = ["No immediate concern identified"]

    return {"level": level, "diseases": diseases, "tips": tips}


# ════════════════════════════════════════════════
#   ROUTES
# ════════════════════════════════════════════════

@app.route("/")
def index():
    return jsonify({"status": "running", "message": "Health Risk Prediction API"})


@app.route("/health")
def health():
    return jsonify({"status": "ok", "model_loaded": model_pkg is not None})


# ── /predict ────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    if model_pkg is None:
        return jsonify({"error": "Model not loaded. Run training first: python train_model.py"}), 503

    try:
        data = request.get_json(force=True)

        # Map frontend field names to backend field names
        field_mapping = {
            "weight": "weight_kg",
            "height": "height_cm",
            "water_intake": "water_intake_l",
            "calories": "calories_consumed",
        }
        for frontend_name, backend_name in field_mapping.items():
            if frontend_name in data and backend_name not in data:
                data[backend_name] = data[frontend_name]

        # BMI calculation - accept both weight/height and weight_kg/height_cm
        if ("weight_kg" in data or "weight" in data) and ("height_cm" in data or "height" in data):
            weight = float(data.get("weight_kg", data.get("weight", 70)))
            height = float(data.get("height_cm", data.get("height", 170)))
            data["bmi"] = calc_bmi(weight, height)
        elif "bmi" not in data:
            return jsonify({"error": "Provide either (weight + height) or bmi"}), 400

        # Required field check
        required = ["age", "gender", "daily_steps", "sleep_hours", "water_intake_l",
                    "calories_consumed", "smoker", "alcohol", "resting_hr",
                    "systolic_bp", "diastolic_bp", "cholesterol", "family_history", "bmi"]
        missing = [f for f in required if f not in data or data[f] == ""]
        if missing:
            return jsonify({"error": f"Missing fields: {missing}"}), 400

        features = build_features(data)
        model    = model_pkg["model"]

        pred     = int(model.predict(features)[0])
        prob     = float(model.predict_proba(features)[0][1])
        advice   = risk_advice(prob, data)

        return jsonify({
            "disease_risk"     : pred,
            "risk_probability" : round(prob * 100, 1),
            "risk_level"       : advice["level"],
            "bmi"              : round(data["bmi"], 2),
            "possible_diseases": advice["diseases"],
            "health_tips"      : advice["tips"],
            "model_accuracy"   : model_meta.get("accuracy", "N/A"),
        })

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Prediction failed. Check server logs."}), 500


# ── /model-info ──────────────────────────────────
@app.route("/model-info")
def model_info():
    if not model_meta:
        return jsonify({"error": "No metadata found"}), 404
    return jsonify(model_meta)
FALLBACK_RESPONSES = {
    "bmi"      : "BMI (Body Mass Index) is weight(kg) / height(m)². Normal: 18.5–24.9.",
    "diet"     : "A balanced diet includes fruits, vegetables, lean proteins, whole grains & healthy fats.",
    "exercise" : "Adults should aim for 150 min of moderate exercise per week (e.g., 30 min walks × 5 days).",
    "sleep"    : "Aim for 7–9 hours of quality sleep. Poor sleep raises heart disease and diabetes risk.",
    "cholesterol": "Keep total cholesterol below 200 mg/dL. Eat oats, fish, nuts; avoid trans fats.",
    "blood pressure": "Normal BP is < 120/80 mmHg. Reduce salt, exercise regularly, and manage stress.",
    "diabetes" : "Type 2 diabetes risk drops with regular exercise, healthy weight, and low-sugar diet.",
    "smoking"  : "Smoking doubles heart disease risk. Quitting has immediate health benefits.",
    "water"    : "Drink 2–3 litres of water daily. Hydration supports kidney, skin, and brain health.",
    "stress"   : "Chronic stress raises BP and cortisol. Try meditation, breathing exercises, or yoga.",
}

def fallback_response(message: str) -> str:
    msg = message.lower()
    for kw, ans in FALLBACK_RESPONSES.items():
        if kw in msg:
            return ans
    return ("I can help with questions about BMI, diet, exercise, sleep, cholesterol, "
            "blood pressure, diabetes, smoking, hydration, or stress. "
            "Please ask a specific health question!")


@app.route("/chatbot", methods=["POST"])
def chatbot():
    data    = request.get_json(force=True)
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "Empty message"}), 400

    # Try Gemini API (Google)
    if GOOGLE_API_KEY:
        try:
            # Use urllib.request (built-in) for maximum compatibility
            import urllib.request
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GOOGLE_API_KEY}"
            
            payload = {
                "system_instruction": {
                    "parts": [{"text": "You are a friendly health assistant. Give concise, evidence-based health advice in 2-3 sentences. Always recommend consulting a doctor for medical concerns."}]
                },
                "contents": [{
                    "parts": [{"text": message}]
                }],
                "generationConfig": {
                    "maxOutputTokens": 400,
                    "temperature": 0.7,
                }
            }

            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
            
            with urllib.request.urlopen(req, timeout=15) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                if "candidates" in result and result["candidates"]:
                    reply = result["candidates"][0]["content"]["parts"][0]["text"].strip()
                    return jsonify({"response": reply, "source": "gemini"})
                else:
                    print(f"Gemini API returned no candidates: {result}")
        except Exception as e:
            print(f"Gemini API Error: {e}")
            if hasattr(e, 'read'):
                print(f"Error detail: {e.read().decode()}")


    # Try Groq API (Inference engine)
    if GROK_API_KEY:
        try:
            import urllib.request
            payload = json.dumps({
                "model"   : "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system",
                     "content": "You are a friendly health assistant. Give concise, evidence-based health advice in 2-3 sentences. Always recommend consulting a doctor for medical concerns."},
                    {"role": "user", "content": message}
                ],
                "max_tokens": 400,
            }).encode()

            req = urllib.request.Request(
                "https://api.groq.com/openai/v1/chat/completions",
                data    = payload,
                headers = {
                    "Content-Type" : "application/json",
                    "Authorization": f"Bearer {GROK_API_KEY}",
                },
                method  = "POST"
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                result = json.loads(resp.read())
            reply = result["choices"][0]["message"]["content"].strip()
            return jsonify({"response": reply, "source": "groq"})
        except Exception as e:
            print(f"Groq API error: {e}")
            if hasattr(e, 'read'):
                print(f"Groq detail: {e.read().decode()}")

    # Fallback
    return jsonify({
        "response": fallback_response(message),
        "source"  : "fallback",
        "note"    : "API not connected — set GROK_API_KEY env var for live responses."
    })


# ────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("  Health Risk Prediction - Flask API")
    print("  http://127.0.0.1:5000")
    print("=" * 50 + "\n")
    app.run(debug=True, host="0.0.0.0", port=5000)

