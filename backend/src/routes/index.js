const { Router } = require("express");

const healthRoutes = require("./health.routes");
const metaRoutes = require("./meta.routes");
const predictionRoutes = require("./prediction.routes");
const dashboardRoutes = require("./dashboard.routes");
const authRoutes = require("./auth.routes");
const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Stress Detection AI API is running.",
    data: {
      health: "/health",

      auth: "/auth",

      formMeta: "/meta/form",

      createPrediction: "/predictions",

      history: "/predictions",

      dashboard: "/dashboard/summary",

      model: "TensorFlow + FastAPI AI Service"
    }
  });
});

router.use("/health", healthRoutes);

router.use("/meta", metaRoutes);

router.use("/predictions", predictionRoutes);

router.use("/dashboard", dashboardRoutes);

router.use("/auth", authRoutes);

module.exports = router;