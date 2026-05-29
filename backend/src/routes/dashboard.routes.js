const { Router } = require("express");
const { asyncHandler } = require("../utils/async-handler");
const { getSummary } = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = Router();

router.get("/summary", requireAuth, asyncHandler(getSummary));
router.get("/", requireAuth, asyncHandler(getSummary));

module.exports = router;