from fastapi import FastAPI
from pydantic import BaseModel
from model_service import predict_model
from genai_service import generate_recommendation


app = FastAPI(
    title="Stress Detection API",
    description="REST API untuk prediksi tingkat stres berdasarkan pola tidur harian",
    version="1.0.0"
)


class StressInput(BaseModel):
    age: float
    sleep_hours: float
    sleep_quality_score: float
    daily_screen_time_hours: float
    phone_usage_before_sleep_minutes: float
    gender: str


@app.get("/")
def home():
    return {
        "message": "Stress Detection API is running",
        "endpoint": "/predict"
    }


@app.post("/predict")
def predict(data: StressInput):
    prediction = predict_model(
        age=data.age,
        sleep_hours=data.sleep_hours,
        sleep_quality_score=data.sleep_quality_score,
        daily_screen_time_hours=data.daily_screen_time_hours,
        phone_usage_before_sleep_minutes=data.phone_usage_before_sleep_minutes,
        gender=data.gender
    )

    recommendation_input = {
        **prediction,
        "age": data.age,
        "sleep_hours": data.sleep_hours,
        "sleep_quality_score": data.sleep_quality_score,
        "daily_screen_time_hours": data.daily_screen_time_hours,
        "phone_usage_before_sleep_minutes": data.phone_usage_before_sleep_minutes
    }

    recommendation = generate_recommendation(recommendation_input)

    return {
        "status": "success",
        "input": data.model_dump(),
        "prediction": prediction,
        "recommendation": recommendation
    }
