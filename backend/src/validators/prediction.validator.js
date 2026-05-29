const { z } = require("zod");

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Format tanggal harus YYYY-MM-DD."
});

const predictionInputSchema = z.object({
  sleepDate: dateStringSchema,

  age: z.number().min(1).max(120),

  gender: z.enum(["male", "female", "other"]),

  sleepHours: z.number().min(0).max(24),

  sleepQualityScore: z.number().min(1).max(10),

  dailyScreenTimeHours: z.number().min(0).max(24),

  phoneUsageBeforeSleepMinutes: z.number().min(0).max(300),

  notes: z.string().trim().max(500).optional()
});

const predictionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  stressLevel: z.enum(["Rendah", "Sedang", "Tinggi"]).optional()
});

module.exports = {
  predictionInputSchema,
  predictionQuerySchema
};