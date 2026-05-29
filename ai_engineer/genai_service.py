import os
from openai import OpenAI


client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="REMOVED_OPENROUTER_KEY"
)


def fallback_recommendation(stress_level):
    if stress_level == "High Stress":
        return """
- Kurangi penggunaan gadget sebelum tidur.
- Usahakan tidur 7-8 jam setiap malam.
- Lakukan relaksasi ringan seperti pernapasan dalam atau stretching.
- Jika stres berlanjut, pertimbangkan berkonsultasi dengan profesional.
- Catatan: hasil ini bukan diagnosis medis.
"""
    elif stress_level == "Medium Stress":
        return """
- Perbaiki rutinitas tidur secara bertahap.
- Batasi screen time menjelang tidur.
- Luangkan waktu untuk aktivitas ringan atau relaksasi.
- Catatan: hasil ini bukan diagnosis medis.
"""
    else:
        return """
- Pertahankan pola tidur yang baik.
- Tetap batasi penggunaan gadget sebelum tidur.
- Lakukan aktivitas fisik ringan secara rutin.
- Catatan: hasil ini bukan diagnosis medis.
"""


def generate_recommendation(data):
    prompt = f"""
Kamu adalah asisten kesehatan preventif.
Berikan rekomendasi singkat, aman, dan mudah dipahami dalam bahasa Indonesia.

Data pengguna:
- Tingkat stres: {data['stress_level']}
- Stress score: {data['stress_score']}%
- Usia: {data['age']}
- Durasi tidur: {data['sleep_hours']} jam
- Kualitas tidur: {data['sleep_quality_score']}/10
- Screen time: {data['daily_screen_time_hours']} jam
- Penggunaan HP sebelum tidur: {data['phone_usage_before_sleep_minutes']} menit

Berikan:
1. Penjelasan singkat hasil prediksi
2. Rekomendasi pola tidur
3. Rekomendasi penggunaan gadget
4. Catatan bahwa ini bukan diagnosis medis
"""

    try:
        response = client.chat.completions.create(
            model="openrouter/auto",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        print("OpenRouter Error:", e)
        return fallback_recommendation(data["stress_level"])