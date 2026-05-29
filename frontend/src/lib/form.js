export const fallbackFormMeta = {
  fields: [
    {
      name: "sleepDate",
      label: "Tanggal Tidur",
      type: "date",
      required: true,
      placeholder: "Pilih tanggal"
    },
    {
      name: "age",
      label: "Usia",
      type: "number",
      required: true,
      min: 1,
      max: 120,
      placeholder: "Contoh: 22"
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
      options: ["male", "female", "other"],
      placeholder: "Pilih gender"
    },
    {
      name: "sleepHours",
      label: "Durasi Tidur (jam)",
      type: "number",
      required: true,
      min: 0,
      max: 24,
      step: 0.5,
      placeholder: "Contoh: 7.5"
    },
    {
      name: "sleepQualityScore",
      label: "Kualitas Tidur",
      type: "range",
      required: true,
      min: 1,
      max: 10,
      placeholder: "Skala 1-10"
    },
    {
      name: "dailyScreenTimeHours",
      label: "Screen Time Harian (jam)",
      type: "number",
      required: true,
      min: 0,
      max: 24,
      step: 0.5,
      placeholder: "Contoh: 6"
    },
    {
      name: "phoneUsageBeforeSleepMinutes",
      label: "Penggunaan HP Sebelum Tidur (menit)",
      type: "number",
      required: true,
      min: 0,
      max: 300,
      placeholder: "Contoh: 60"
    },
    {
      name: "notes",
      label: "Catatan",
      type: "textarea",
      required: false,
      maxLength: 500,
      placeholder: "Tambahkan catatan singkat (opsional)"
    }
  ],
  stressLevels: ["Rendah", "Sedang", "Tinggi"]
};

const fieldDefaults = {
  age: "",
  gender: "male",
  sleepHours: "",
  sleepQualityScore: 1,
  dailyScreenTimeHours: "",
  phoneUsageBeforeSleepMinutes: "",
  notes: ""
};

export function createInitialFormValues(fields = fallbackFormMeta.fields) {
  const values = {};

  for (const field of fields) {
    if (field.name === "sleepDate") {
      values[field.name] = new Date().toISOString().slice(0, 10);
      continue;
    }

    if (field.type === "textarea") {
      values[field.name] = "";
      continue;
    }

    if (field.type === "select") {
      values[field.name] =
        fieldDefaults[field.name] ||
        field.options?.[0] ||
        "";
      continue;
    }

    values[field.name] =
      fieldDefaults[field.name] ??
      (typeof field.min === "number" && typeof field.max === "number"
        ? Number(((field.min + field.max) / 2).toFixed(1))
        : "");
  }

  return values;
}

export function mergeFormMeta(meta) {
  const fallbackFieldMap = Object.fromEntries(
    fallbackFormMeta.fields.map((field) => [field.name, field])
  );

  return {
    ...fallbackFormMeta,
    ...meta,
    fields: (meta?.fields || fallbackFormMeta.fields).map((field) => ({
      ...fallbackFieldMap[field.name],
      ...field
    }))
  };
}

export function validateForm(values, fields = fallbackFormMeta.fields) {
  const errors = {};

  for (const field of fields) {
    const value = values[field.name];

    if (
      field.required &&
      (value === "" || value === null || value === undefined)
    ) {
      errors[field.name] = "Field ini wajib diisi.";
      continue;
    }

    if (
      field.type === "date" &&
      value &&
      !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      errors[field.name] = "Gunakan format tanggal YYYY-MM-DD.";
      continue;
    }

    if (field.type === "select") {
      if (field.options?.length && !field.options.includes(value)) {
        errors[field.name] = "Pilih opsi yang valid.";
      }

      continue;
    }

    if (field.type === "number" || field.type === "range") {
      if (Number.isNaN(Number(value))) {
        errors[field.name] = "Masukkan angka yang valid.";
        continue;
      }

      const numericValue = Number(value);

      if (typeof field.min === "number" && numericValue < field.min) {
        errors[field.name] = `Nilai minimum adalah ${field.min}.`;
      } else if (typeof field.max === "number" && numericValue > field.max) {
        errors[field.name] = `Nilai maksimum adalah ${field.max}.`;
      }
    }

    if (
      field.type === "textarea" &&
      value &&
      field.maxLength &&
      value.length > field.maxLength
    ) {
      errors[field.name] = `Maksimal ${field.maxLength} karakter.`;
    }
  }

  return errors;
}

export function normalizePayload(values, fields = fallbackFormMeta.fields) {
  const payload = {};

  for (const field of fields) {
    const value = values[field.name];

    if (field.type === "number" || field.type === "range") {
      payload[field.name] = Number(value);
    } else if (field.type === "textarea") {
      payload[field.name] = value?.trim() ? value.trim() : undefined;
    } else {
      payload[field.name] = value;
    }
  }

  return payload;
}