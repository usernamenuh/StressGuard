const { getDatabase } = require("../db/database");
const { generatePrediction } = require("../services/prediction.service");
const {
  predictionInputSchema,
  predictionQuerySchema,
} = require("../validators/prediction.validator");
const { HttpError } = require("../utils/http-error");

function mapPredictionRow(row) {
  let recommendations = [];
  try {
    if (row.recommendations) {
      recommendations = JSON.parse(row.recommendations);
      if (!Array.isArray(recommendations)) {
        recommendations = [recommendations];
      }
    }
  } catch (e) {
    console.error("Failed to parse recommendations:", e);
  }

  return {
    id: row.id,
    sleepDate: row.sleepDate,

    age: row.age,

    gender: row.gender,

    sleepHours: row.sleepHours,

    sleepQualityScore: row.sleepQualityScore,

    dailyScreenTimeHours: row.dailyScreenTimeHours,

    phoneUsageBeforeSleepMinutes: row.phoneUsageBeforeSleepMinutes,

    notes: row.notes,

    stressScore: row.stressScore,

    stressLevel: row.stressLevel,

    confidence: row.confidence,

    recommendations: recommendations,

    modelProvider: row.modelProvider,

    modelVersion: row.modelVersion,

    createdAt: row.createdAt,
  };
}

async function createPrediction(req, res) {
  const payload = predictionInputSchema.parse(req.body);

  const result = await generatePrediction(payload);

  const db = await getDatabase();

  const insertResult = await db.run(
    `
INSERT INTO predictions (
  user_id,

  sleep_date,

  age,

  gender,

  sleep_hours,

  sleep_quality_score,

  daily_screen_time_hours,

  phone_usage_before_sleep_minutes,

  notes,

  stress_score,

  stress_level,

  confidence,

  recommendations,

  model_provider,

  model_version
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      req.user.id,

      payload.sleepDate,

      payload.age,

      payload.gender,

      payload.sleepHours,

      payload.sleepQualityScore,

      payload.dailyScreenTimeHours,

      payload.phoneUsageBeforeSleepMinutes,

      payload.notes || null,

      result.stressScore,

      result.stressLevel,

      result.confidence,

      JSON.stringify(result.recommendations),

      result.modelProvider,

      result.modelVersion,
    ],
  );

  const saved = await db.get(
    `
      SELECT
        id,

        sleep_date AS sleepDate,

        age,

        gender,

        sleep_hours AS sleepHours,

        sleep_quality_score AS sleepQualityScore,

        daily_screen_time_hours AS dailyScreenTimeHours,

        phone_usage_before_sleep_minutes
          AS phoneUsageBeforeSleepMinutes,

        notes,

        stress_score AS stressScore,

        stress_level AS stressLevel,

        confidence,

        recommendations,

        model_provider AS modelProvider,

        model_version AS modelVersion,

        created_at AS createdAt

      FROM predictions

      WHERE id = ?
AND user_id = ?
    `,
    [insertResult.lastID, req.user.id],
  );

  res.status(201).json({
    success: true,
    message: "Prediction generated successfully.",
    data: mapPredictionRow(saved),
  });
}

async function getPredictions(req, res) {
  const query = predictionQuerySchema.parse(req.query);

  const db = await getDatabase();

  const offset = (query.page - 1) * query.limit;

  const params = [req.user.id];

  let whereClause = `
  WHERE user_id = ?
`;

  if (query.stressLevel) {
    whereClause += `
    AND stress_level = ?
  `;

    params.push(query.stressLevel);
  }

  const totalRow = await db.get(
    `SELECT COUNT(*) AS total FROM predictions ${whereClause}`,
    params,
  );

  const rows = await db.all(
    `
      SELECT
        id,

        sleep_date AS sleepDate,

        age,

        gender,

        sleep_hours AS sleepHours,

        sleep_quality_score AS sleepQualityScore,

        daily_screen_time_hours AS dailyScreenTimeHours,

        phone_usage_before_sleep_minutes
          AS phoneUsageBeforeSleepMinutes,

        notes,

        stress_score AS stressScore,

        stress_level AS stressLevel,

        confidence,

        recommendations,

        model_provider AS modelProvider,

        model_version AS modelVersion,

        created_at AS createdAt

      FROM predictions

      ${whereClause}

      ORDER BY id DESC

      LIMIT ? OFFSET ?
    `,
    [...params, query.limit, offset],
  );

  res.json({
    success: true,
    data: rows.map(mapPredictionRow),
    meta: {
      page: query.page,
      limit: query.limit,
      total: totalRow.total,
      totalPages: Math.ceil(totalRow.total / query.limit) || 1,
    },
  });
}

async function getPredictionById(req, res) {
  const db = await getDatabase();

  const row = await db.get(
    `
      SELECT
        id,

        sleep_date AS sleepDate,

        age,

        gender,

        sleep_hours AS sleepHours,

        sleep_quality_score AS sleepQualityScore,

        daily_screen_time_hours AS dailyScreenTimeHours,

        phone_usage_before_sleep_minutes
          AS phoneUsageBeforeSleepMinutes,

        notes,

        stress_score AS stressScore,

        stress_level AS stressLevel,

        confidence,

        recommendations,

        model_provider AS modelProvider,

        model_version AS modelVersion,

        created_at AS createdAt

      FROM predictions

      WHERE id = ?
AND user_id = ?
    `,
    req.params.id,
    req.user.id,
  );

  if (!row) {
    throw new HttpError(404, "Prediction not found.");
  }

  res.json({
    success: true,
    data: mapPredictionRow(row),
  });
}

module.exports = {
  createPrediction,
  getPredictions,
  getPredictionById,
};
