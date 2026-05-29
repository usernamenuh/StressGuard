import gradio as gr

from model_service import predict_model
from genai_service import generate_recommendation


def predict_stress(
    age,
    sleep_hours,
    sleep_quality_score,
    daily_screen_time_hours,
    phone_usage_before_sleep_minutes,
    gender
):
    prediction = predict_model(
        age,
        sleep_hours,
        sleep_quality_score,
        daily_screen_time_hours,
        phone_usage_before_sleep_minutes,
        gender
    )

    data = {
        **prediction,
        "age": age,
        "sleep_hours": sleep_hours,
        "sleep_quality_score": sleep_quality_score,
        "daily_screen_time_hours": daily_screen_time_hours,
        "phone_usage_before_sleep_minutes": phone_usage_before_sleep_minutes
    }

    recommendation = generate_recommendation(data)

    return f"""
## Hasil Prediksi

**Tingkat Stres:** {prediction['stress_level']}

**Stress Score:** {prediction['stress_score']}%

### Probabilitas
- High Stress: {prediction['high_probability']}%
- Low Stress: {prediction['low_probability']}%
- Medium Stress: {prediction['medium_probability']}%

---

## Rekomendasi Kesehatan

{recommendation}
"""


demo = gr.Interface(
    fn=predict_stress,
    inputs=[
        gr.Number(label="Usia", value=22),
        gr.Number(label="Durasi tidur per hari (jam)", value=6),
        gr.Slider(1, 10, value=5, step=1, label="Kualitas tidur"),
        gr.Number(label="Screen time harian (jam)", value=6),
        gr.Number(label="Penggunaan HP sebelum tidur (menit)", value=60),
        gr.Radio(["male", "female", "other"], label="Gender", value="male")
    ],
    outputs=gr.Markdown(),
    title="Deteksi Dini Tingkat Stres",
    description="Prediksi tingkat stres berdasarkan pola tidur dan kebiasaan penggunaan perangkat digital."
)

if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860
    )