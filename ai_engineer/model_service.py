import joblib
import numpy as np
import pandas as pd
import tensorflow as tf


class CustomDenseBlock(tf.keras.layers.Layer):
    def __init__(self, units, dropout_rate=0.1, **kwargs):
        super().__init__(**kwargs)
        self.units = units
        self.dropout_rate = dropout_rate
        self.dense = tf.keras.layers.Dense(units, activation="relu")
        self.batch_norm = tf.keras.layers.BatchNormalization()
        self.dropout = tf.keras.layers.Dropout(dropout_rate)

    def call(self, inputs, training=False):
        x = self.dense(inputs)
        x = self.batch_norm(x, training=training)
        x = self.dropout(x, training=training)
        return x

    def get_config(self):
        config = super().get_config()
        config.update({
            "units": self.units,
            "dropout_rate": self.dropout_rate
        })
        return config


model = tf.keras.models.load_model(
    "best_model_gradient_tape.keras",
    custom_objects={"CustomDenseBlock": CustomDenseBlock}
)

scaler = joblib.load("scaler.pkl")

label_mapping = {
    0: "High Stress",
    1: "Low Stress",
    2: "Medium Stress"
}

numerical_cols = [
    "age",
    "sleep_hours",
    "sleep_quality_score",
    "daily_screen_time_hours",
    "phone_usage_before_sleep_minutes"
]

selected_features = [
    "age",
    "sleep_hours",
    "sleep_quality_score",
    "daily_screen_time_hours",
    "phone_usage_before_sleep_minutes",
    "gender_Female",
    "gender_Male",
    "gender_Other"
]


def predict_model(
    age,
    sleep_hours,
    sleep_quality_score,
    daily_screen_time_hours,
    phone_usage_before_sleep_minutes,
    gender
):
    gender = gender.lower()

    sample = pd.DataFrame([{
        "age": age,
        "sleep_hours": sleep_hours,
        "sleep_quality_score": sleep_quality_score,
        "daily_screen_time_hours": daily_screen_time_hours,
        "phone_usage_before_sleep_minutes": phone_usage_before_sleep_minutes,
        "gender_Female": 1 if gender == "female" else 0,
        "gender_Male": 1 if gender == "male" else 0,
        "gender_Other": 1 if gender == "other" else 0
    }])

    sample = sample[selected_features]

    sample_scaled = sample.copy()
    sample_scaled[numerical_cols] = scaler.transform(sample[numerical_cols])

    pred = model.predict(sample_scaled, verbose=0)[0]
    pred_class = int(np.argmax(pred))

    return {
        "stress_level": label_mapping[pred_class],
        "stress_score": round(float(pred[pred_class] * 100), 2),
        "high_probability": round(float(pred[0] * 100), 2),
        "low_probability": round(float(pred[1] * 100), 2),
        "medium_probability": round(float(pred[2] * 100), 2)
    }