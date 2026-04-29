"""
Health Risk Prediction — Model Training Script
==============================================
Dataset columns:
  id, age, gender, bmi, daily_steps, sleep_hours, water_intake_l,
  calories_consumed, smoker, alcohol, resting_hr, systolic_bp,
  diastolic_bp, cholesterol, family_history, disease_risk (target)

NOTE: BMI in this training file comes from the CSV directly.
      In production (Flask API), BMI is calculated from weight+height.
"""

import os, sys, warnings, json, time
import pandas as pd
import numpy as np
import pickle

from sklearn.model_selection import train_test_split, RandomizedSearchCV, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix,
    roc_auc_score, f1_score
)
from sklearn.pipeline import Pipeline
from sklearn.inspection import permutation_importance

warnings.filterwarnings("ignore")

# ────────────────────────────────────────────────
# 0.  Paths
# ────────────────────────────────────────────────
SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)

DATASET_PATH = os.path.join(SCRIPT_DIR, "health_lifestyle_dataset.csv")
MODEL_PATH   = os.path.join(SCRIPT_DIR, "health_risk_model.pkl")
META_PATH    = os.path.join(SCRIPT_DIR, "model_meta.json")

# ────────────────────────────────────────────────
# 1.  Load Dataset
# ────────────────────────────────────────────────
def load_data(path: str) -> pd.DataFrame:
    print(f"\n[1/6] Loading dataset from: {path}")
    if not os.path.exists(path):
        sys.exit(f"ERROR: Dataset not found at '{path}'\n"
                 f"       Copy your CSV/XLS file there and rename it "
                 f"'health_lifestyle_dataset.csv'")
    df = pd.read_csv(path)
    print(f"      Rows: {len(df):,}  |  Columns: {len(df.columns)}")
    print(f"      Target distribution:\n{df['disease_risk'].value_counts()}")
    return df


# ────────────────────────────────────────────────
# 2.  Preprocessing
# ────────────────────────────────────────────────
FEATURE_COLS = [
    "age", "gender", "bmi", "daily_steps", "sleep_hours",
    "water_intake_l", "calories_consumed", "smoker", "alcohol",
    "resting_hr", "systolic_bp", "diastolic_bp",
    "cholesterol", "family_history"
]
TARGET_COL = "disease_risk"


def preprocess(df: pd.DataFrame):
    print("\n[2/6] Preprocessing …")
    df = df.copy()

    # --- encode gender ---
    le = LabelEncoder()
    df["gender"] = le.fit_transform(df["gender"].astype(str))   # Female→0, Male→1

    # --- feature engineering ---
    df["bmi_category"]   = pd.cut(df["bmi"],
                                  bins=[0, 18.5, 24.9, 29.9, 100],
                                  labels=[0, 1, 2, 3]).astype(int)
    df["pulse_pressure"]  = df["systolic_bp"] - df["diastolic_bp"]
    df["activity_score"]  = df["daily_steps"] / 1000          # normalise steps
    df["sleep_quality"]   = (df["sleep_hours"] >= 6) & (df["sleep_hours"] <= 9)
    df["sleep_quality"]   = df["sleep_quality"].astype(int)
    df["hypertension"]    = ((df["systolic_bp"] >= 130) | (df["diastolic_bp"] >= 80)).astype(int)
    df["high_cholesterol"]= (df["cholesterol"] >= 200).astype(int)
    df["risk_score"]      = (df["smoker"] + df["alcohol"] +
                             df["family_history"] + df["hypertension"] +
                             df["high_cholesterol"])

    extra_cols = [
        "bmi_category", "pulse_pressure", "activity_score",
        "sleep_quality", "hypertension", "high_cholesterol", "risk_score"
    ]
    features = FEATURE_COLS + extra_cols
    X = df[features]
    y = df[TARGET_COL]

    print(f"      Feature set size: {X.shape[1]} features, {X.shape[0]:,} rows")
    return X, y, features, le


# ────────────────────────────────────────────────
# 3.  Train / Test Split
# ────────────────────────────────────────────────
def split(X, y):
    print("\n[3/6] Splitting dataset (80/20 stratified) …")
    Xtr, Xte, ytr, yte = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"      Train: {len(Xtr):,}  |  Test: {len(Xte):,}")
    return Xtr, Xte, ytr, yte


# ────────────────────────────────────────────────
# 4.  Model Training with Hyperparameter Tuning
# ────────────────────────────────────────────────
def train(Xtr, ytr):
    print("\n[4/6] Training model with hyperparameter tuning …")
    print("      (This may take a few minutes on large datasets)\n")

    # --- RandomForest with tuned hyper-params ---
    rf = RandomForestClassifier(
        n_estimators=400,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        max_features="sqrt",
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
        bootstrap=True,
        oob_score=True,
    )

    # Hyper-param search space
    param_dist = {
        "n_estimators"     : [300, 400, 500],
        "max_depth"        : [None, 25, 35],
        "min_samples_split": [2, 5],
        "min_samples_leaf" : [1, 2],
        "max_features"     : ["sqrt", "log2"],
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    search = RandomizedSearchCV(
        estimator   = rf,
        param_distributions = param_dist,
        n_iter      = 12,
        scoring     = "accuracy",
        cv          = cv,
        n_jobs      = -1,
        verbose     = 1,
        random_state= 42,
        refit       = True,
    )

    t0 = time.time()
    search.fit(Xtr, ytr)
    elapsed = time.time() - t0

    best = search.best_estimator_
    print(f"\n      Best params : {search.best_params_}")
    print(f"      CV accuracy : {search.best_score_:.4f}")
    if hasattr(best, "oob_score_"):
        print(f"      OOB score   : {best.oob_score_:.4f}")
    print(f"      Time elapsed: {elapsed:.1f}s")

    return best


# ────────────────────────────────────────────────
# 5.  Evaluation
# ────────────────────────────────────────────────
def evaluate(model, Xte, yte):
    print("\n[5/6] Evaluating on test set …")
    y_pred = model.predict(Xte)
    y_prob = model.predict_proba(Xte)[:, 1]

    acc  = accuracy_score(yte, y_pred)
    f1   = f1_score(yte, y_pred, average="weighted")
    roc  = roc_auc_score(yte, y_prob)
    cm   = confusion_matrix(yte, y_pred)

    print(f"\n  ┌─────────────────────────────────┐")
    print(f"  │  Test Accuracy : {acc*100:6.2f} %         │")
    print(f"  │  F1  (weighted): {f1*100:6.2f} %         │")
    print(f"  │  ROC-AUC       : {roc:.4f}            │")
    print(f"  └─────────────────────────────────┘")

    print("\n  Classification Report:")
    print(classification_report(yte, y_pred,
                                 target_names=["No Risk (0)", "At Risk (1)"]))

    print("  Confusion Matrix:")
    print(f"    TN={cm[0,0]:>6}  FP={cm[0,1]:>6}")
    print(f"    FN={cm[1,0]:>6}  TP={cm[1,1]:>6}")

    if acc < 0.90:
        print("\n  ⚠  Accuracy below 90%. Consider collecting more data or "
              "feature engineering.")
    elif acc < 0.96:
        print("\n  ℹ  Good accuracy. Fine-tune n_iter or add more trees for 96%+.")
    else:
        print("\n  ✅  Target accuracy (≥96%) achieved!")

    return acc, f1, roc


# ────────────────────────────────────────────────
# 6.  Save Model + Metadata
# ────────────────────────────────────────────────
def save_artifacts(model, features, le, acc, f1, roc):
    print("\n[6/6] Saving model artifacts …")

    package = {
        "model"   : model,
        "features": features,
        "le_gender": le,       # needed for inference
    }
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(package, f)

    meta = {
        "accuracy" : round(acc,  4),
        "f1_score" : round(f1,   4),
        "roc_auc"  : round(roc,  4),
        "features" : features,
        "n_features": len(features),
        "model_type": type(model).__name__,
    }
    with open(META_PATH, "w") as f:
        json.dump(meta, f, indent=2)

    print(f"      Model saved → {MODEL_PATH}")
    print(f"      Meta  saved → {META_PATH}")


# ────────────────────────────────────────────────
# MAIN
# ────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 52)
    print("  Health Risk Prediction — Model Trainer")
    print("=" * 52)

    df       = load_data(DATASET_PATH)
    X, y, features, le = preprocess(df)
    Xtr, Xte, ytr, yte = split(X, y)
    model    = train(Xtr, ytr)
    acc, f1, roc = evaluate(model, Xte, yte)
    save_artifacts(model, features, le, acc, f1, roc)

    print("\n✅  Training complete!")
    print(f"    Run the Flask app:  python backend/app.py")
    print("=" * 52)

