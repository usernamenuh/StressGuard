const { Router } = require("express");

const { asyncHandler } = require("../utils/async-handler");

const {
  createPrediction,
  getPredictions,
  getPredictionById
} = require("../controllers/prediction.controller");

const { requireAuth } = require("../middleware/auth.middleware");

const router = Router();

router.post("/", requireAuth, asyncHandler(createPrediction));

router.post("/predict", requireAuth, asyncHandler(createPrediction));

router.get("/", requireAuth, asyncHandler(getPredictions));

router.get("/history", requireAuth, asyncHandler(getPredictions));

router.get("/:id", requireAuth, asyncHandler(getPredictionById));

module.exports = router;