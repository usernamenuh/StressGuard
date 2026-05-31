import sys
import types
import unittest
from pathlib import Path
from unittest.mock import Mock


sys.path.insert(0, str(Path(__file__).resolve().parent))

fake_model_service = types.ModuleType("model_service")
fake_model_service.predict_model = Mock(return_value={
    "stress_level": "Low Stress",
    "stress_score": 91.5,
    "high_probability": 0.0,
    "low_probability": 91.5,
    "medium_probability": 8.5
})

fake_genai_service = types.ModuleType("genai_service")
fake_genai_service.generate_recommendation = Mock(
    return_value="Pertahankan pola tidur yang baik."
)

sys.modules["model_service"] = fake_model_service
sys.modules["genai_service"] = fake_genai_service

from api import StressInput, home, predict  # noqa: E402


class StressDetectionApiTest(unittest.TestCase):
    def test_home_handler_returns_endpoint_metadata(self):
        response = home()

        self.assertEqual(response["endpoint"], "/predict")

    def test_predict_handler_returns_prediction_and_recommendation(self):
        payload = StressInput(**{
            "age": 22,
            "sleep_hours": 6,
            "sleep_quality_score": 7,
            "daily_screen_time_hours": 5,
            "phone_usage_before_sleep_minutes": 30,
            "gender": "male"
        })

        response = predict(payload)

        self.assertEqual(response["status"], "success")
        self.assertEqual(response["prediction"]["stress_level"], "Low Stress")
        self.assertEqual(
            response["recommendation"],
            "Pertahankan pola tidur yang baik."
        )
        fake_model_service.predict_model.assert_called_with(
            age=22.0,
            sleep_hours=6.0,
            sleep_quality_score=7.0,
            daily_screen_time_hours=5.0,
            phone_usage_before_sleep_minutes=30.0,
            gender="male"
        )


if __name__ == "__main__":
    unittest.main()
