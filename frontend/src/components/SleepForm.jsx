function FieldNote({ field }) {
  if (field.type === "range") {
    return (
      <span className="field-note">
        Skala {field.min} sampai {field.max}
      </span>
    );
  }

  if (field.type === "number" && field.max !== undefined) {
    return (
      <span className="field-note">
        Rentang {field.min} sampai {field.max}
      </span>
    );
  }

  if (field.type === "select") {
    return (
      <span className="field-note">
        Pilih salah satu opsi
      </span>
    );
  }

  return null;
}

function getFieldAccent(fieldName) {
  const accentMap = {
    sleepDate: "pink",
    age: "blue",
    gender: "green",
    sleepHours: "blue",
    sleepQualityScore: "yellow",
    dailyScreenTimeHours: "pink",
    phoneUsageBeforeSleepMinutes: "yellow",
    notes: "blue"
  };

  return accentMap[fieldName] || "pink";
}

function shouldUseWideField(field) {
  return field.type === "textarea" || field.name === "phoneUsageBeforeSleepMinutes";
}

export function SleepForm({
  fields,
  values,
  errors,
  isSubmitting,
  submitError,
  successMessage,
  onChange,
  onSubmit
}) {
  return (
    <section className="phone-card form-phone" id="assessment" aria-labelledby="assessment-title">
      <div className="phone-top-copy">
        <span className="section-label">Activities</span>
        <h2 id="assessment-title">Sleep check-in</h2>
        <p>
          Isi data tidur harian untuk memicu prediksi real-time dari backend
          dan menampilkan insight yang terasa seperti aplikasi wellness.
        </p>
      </div>

      <div className="quick-actions">
        <div className="quick-action quick-action-pink">
          <strong>Journal</strong>
          <span>Catat pola yang paling terasa hari ini.</span>
        </div>
        <div className="quick-action quick-action-blue">
          <strong>Breathing</strong>
          <span>Mulai dari ritme napas sebelum mengisi form.</span>
        </div>
      </div>

      <form className="sleep-form" onSubmit={onSubmit}>
        <div className="form-grid">
          {fields.map((field) => {
            const isWide = shouldUseWideField(field);
            const value = values[field.name] ?? "";
            const error = errors[field.name];
            const accent = getFieldAccent(field.name);

            return (
              <label
                key={field.name}
                className={`field-card field-card-${field.name} accent-${accent} ${isWide ? "field-card-wide" : ""} ${
                  error ? "field-card-error" : ""
                }`}
              >
                <div className="field-topline">
                  <span className="field-label">
                    {field.label || field.name}
                    {field.required ? " *" : ""}
                  </span>

                  {field.type === "range" ? (
                    <strong className="range-value">{value}</strong>
                  ) : null}
                </div>

                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows="4"
                    maxLength={field.maxLength}
                    placeholder={field.placeholder || "Tambahkan catatan singkat bila perlu"}
                    value={value}
                    onChange={(event) =>
                      onChange(field.name, event.target.value, field.type)
                    }
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    value={value}
                    onChange={(event) =>
                      onChange(field.name, event.target.value, field.type)
                    }
                  >
                    <option value="" disabled>{field.placeholder || "Pilih salah satu"}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option === "male"
                          ? "Laki-laki"
                          : option === "female"
                          ? "Perempuan"
                          : "Lainnya"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    type={field.type === "range" ? "range" : field.type}
                    min={field.min}
                    max={field.max}
                    step={field.step || (field.type === "range" ? 1 : "any")}
                    placeholder={field.placeholder}
                    value={value}
                    onChange={(event) =>
                      onChange(field.name, event.target.value, field.type)
                    }
                  />
                )}

                <div className="field-footer">
                  <FieldNote field={field} />

                  {field.type === "textarea" ? (
                    <span className="field-note">
                      {(value || "").length}/{field.maxLength || 500}
                    </span>
                  ) : null}
                </div>

                {error ? <span className="field-error">{error}</span> : null}
              </label>
            );
          })}
        </div>

        <div className="form-actions">
          <div className="status-stack">
            {submitError ? <p className="status-message error">{submitError}</p> : null}

            {successMessage ? (
              <p className="status-message success">{successMessage}</p>
            ) : null}
          </div>

          <button type="submit" className="submit-pill" disabled={isSubmitting}>
            {isSubmitting ? "Menganalisis pola tidur..." : "Analisis tingkat stres"}
          </button>
        </div>
      </form>
    </section>
  );
}
