function getFormMeta(req, res) {
  res.json({
    success: true,
    data: {
      fields: [
        {
          name: "sleepDate",
          label: "Tanggal Tidur",
          type: "date",
          required: true
        },

        {
          name: "age",
          label: "Usia",
          type: "number",
          required: true,
          min: 1,
          max: 120
        },

        {
          name: "gender",
          label: "Gender",
          type: "select",
          required: true,
          options: [
            "male",
            "female",
            "other"
          ]
        },

        {
          name: "sleepHours",
          label: "Durasi Tidur (jam)",
          type: "number",
          required: true,
          min: 0,
          max: 24,
          step: 0.5
        },

        {
          name: "sleepQualityScore",
          label: "Kualitas Tidur",
          type: "range",
          required: true,
          min: 1,
          max: 10
        },

        {
          name: "dailyScreenTimeHours",
          label: "Screen Time Harian (jam)",
          type: "number",
          required: true,
          min: 0,
          max: 24,
          step: 0.5
        },

        {
          name: "phoneUsageBeforeSleepMinutes",
          label: "Penggunaan HP Sebelum Tidur (menit)",
          type: "number",
          required: true,
          min: 0,
          max: 300
        },

        {
          name: "notes",
          label: "Catatan",
          type: "textarea",
          required: false,
          maxLength: 500
        }
      ],

      stressLevels: [
        "Rendah",
        "Sedang",
        "Tinggi"
      ]
    }
  });
}

module.exports = {
  getFormMeta
};