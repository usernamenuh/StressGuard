import {
  createInitialFormValues,
  fallbackFormMeta,
  normalizePayload,
  validateForm
} from "../lib/form";

describe("form helpers", () => {
  test("creates sensible defaults for all known fields", () => {
    const values = createInitialFormValues(fallbackFormMeta.fields);

    expect(values.sleepDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(values.age).toBe("");
    expect(values.gender).toBe("male");
    expect(values.sleepHours).toBe("");
    expect(values.sleepQualityScore).toBe(1);
    expect(values.dailyScreenTimeHours).toBe("");
    expect(values.phoneUsageBeforeSleepMinutes).toBe("");
    expect(values.notes).toBe("");
  });

  test("returns validation errors for invalid values", () => {
    const errors = validateForm(
      {
        sleepDate: "14-05-2026",
        age: 0,
        gender: "unknown",
        sleepHours: -1,
        sleepQualityScore: 0,
        dailyScreenTimeHours: 25,
        phoneUsageBeforeSleepMinutes: 301,
        notes: ""
      },
      fallbackFormMeta.fields
    );

    expect(errors.sleepDate).toBeDefined();
    expect(errors.age).toBeDefined();
    expect(errors.gender).toBeDefined();
    expect(errors.sleepHours).toBeDefined();
    expect(errors.sleepQualityScore).toBeDefined();
    expect(errors.dailyScreenTimeHours).toBeDefined();
    expect(errors.phoneUsageBeforeSleepMinutes).toBeDefined();
  });

  test("normalizes payload values before sending to backend", () => {
    const payload = normalizePayload(
      {
        sleepDate: "2026-05-14",
        age: "22",
        gender: "male",
        sleepHours: "6.5",
        sleepQualityScore: "4",
        dailyScreenTimeHours: "8",
        phoneUsageBeforeSleepMinutes: "120",
        notes: "  Sulit tidur  "
      },
      fallbackFormMeta.fields
    );

    expect(payload.age).toBe(22);
    expect(payload.sleepHours).toBe(6.5);
    expect(payload.sleepQualityScore).toBe(4);
    expect(payload.dailyScreenTimeHours).toBe(8);
    expect(payload.phoneUsageBeforeSleepMinutes).toBe(120);
    expect(payload.notes).toBe("Sulit tidur");
  });
});
