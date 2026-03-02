from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from logic import generate_ams_alerts, predict_antibiotic
from schemas import AMSOutput, PatientInput, RecommendationOutput

app = FastAPI(title="ABX-AI Clinical Decision Support API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
def ping() -> dict:
    return {"status": "ok"}


@app.post("/predict", response_model=RecommendationOutput)
def predict(payload: PatientInput) -> RecommendationOutput:
    prediction = predict_antibiotic(payload)
    return RecommendationOutput(**prediction)


@app.post("/ams", response_model=AMSOutput)
def ams(payload: PatientInput) -> AMSOutput:
    prediction = predict_antibiotic(payload)
    alerts = generate_ams_alerts(payload, prediction)
    return AMSOutput(alerts=alerts)
