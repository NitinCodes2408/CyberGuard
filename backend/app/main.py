import os
import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .database import SessionLocal, ThreatLog


app = FastAPI(
    title="AI Cyber Threat Detection System",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Load Models
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

binary_model_path = os.path.join(
    BASE_DIR, "models", "cyber_threat_model.pkl"
)

category_model_path = os.path.join(
    BASE_DIR, "models", "attack_category_model.pkl"
)

binary_model = joblib.load(binary_model_path)
category_model = joblib.load(category_model_path)


# -----------------------------
# Input Data
# -----------------------------

class NetworkTraffic(BaseModel):
    dur: float
    proto: str
    service: str
    state: str
    spkts: float
    dpkts: float
    sbytes: float
    dbytes: float
    rate: float
    sttl: float
    dttl: float
    sload: float
    dload: float
    sloss: float
    dloss: float
    sinpkt: float
    dinpkt: float
    sjit: float
    djit: float
    swin: float
    stcpb: float
    dtcpb: float
    dwin: float
    tcprtt: float
    synack: float
    ackdat: float
    smean: float
    dmean: float
    trans_depth: float
    response_body_len: float
    ct_srv_src: float
    ct_state_ttl: float
    ct_dst_ltm: float
    ct_src_dport_ltm: float
    ct_dst_sport_ltm: float
    ct_dst_src_ltm: float
    is_ftp_login: float
    ct_ftp_cmd: float
    ct_flw_http_mthd: float
    ct_src_ltm: float
    ct_srv_dst: float
    is_sm_ips_ports: float


# -----------------------------
# Health Check
# -----------------------------

@app.get("/health")
def health_check():
    return {
        "status": "running",
        "message": "AI Cyber Threat Detection API is active"
    }


# -----------------------------
# Prediction
# -----------------------------

@app.post("/predict")
def predict_traffic(traffic: NetworkTraffic):

    data = pd.DataFrame([traffic.model_dump()])

    # Binary prediction
    binary_prediction = binary_model.predict(data)[0]

    if binary_prediction == 0:
        prediction = "Normal"
        attack_type = "None"
        is_attack = False

    else:
        prediction = "Attack"
        attack_type = category_model.predict(data)[0]
        is_attack = True

    # -----------------------------
    # Save prediction to database
    # -----------------------------

    db = SessionLocal()

    try:
        log = ThreatLog(
            prediction=prediction,
            attack_type=attack_type
        )

        db.add(log)
        db.commit()

    finally:
        db.close()

    # -----------------------------
    # Return response
    # -----------------------------

    return {
        "prediction": prediction,
        "attack": is_attack,
        "attack_type": attack_type
    }


# -----------------------------
# Threat History
# -----------------------------

@app.get("/stats")
def get_stats():
    db = SessionLocal()

    try:
        total = db.query(ThreatLog).count()

        attacks = (
            db.query(ThreatLog)
            .filter(ThreatLog.prediction == "Attack")
            .count()
        )

        normal = (
            db.query(ThreatLog)
            .filter(ThreatLog.prediction == "Normal")
            .count()
        )

        attack_types = {}

        threats = (
            db.query(ThreatLog)
            .filter(ThreatLog.prediction == "Attack")
            .all()
        )

        for threat in threats:
            attack_type = threat.attack_type

            if attack_type not in attack_types:
                attack_types[attack_type] = 0

            attack_types[attack_type] += 1

        return {
            "total_predictions": total,
            "total_attacks": attacks,
            "total_normal": normal,
            "attack_types": attack_types
        }

    finally:
        db.close()


# -----------------------------
# Recent Threat Logs
# -----------------------------

@app.get("/threats")
def get_threats(limit: int = 100):
    db = SessionLocal()

    try:
        logs = (
            db.query(ThreatLog)
            .order_by(ThreatLog.id.desc())
            .limit(limit)
            .all()
        )

        return [
            {
                "id": log.id,
                "prediction": log.prediction,
                "attack_type": log.attack_type,
                "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.timestamp else "",
                "status": log.prediction
            }
            for log in logs
        ]

    finally:
        db.close()
  