const { Router } = require("express");

const {
  register,
  login,
  me,
  googleLogin
} = require("../controllers/auth.controller");

const { asyncHandler } = require("../utils/async-handler");
const { requireAuth } = require("../middleware/auth.middleware");

const router = Router();

router.post("/register", asyncHandler(register));

router.post("/login", asyncHandler(login));

router.post("/google", asyncHandler(googleLogin));

router.get("/me", requireAuth, asyncHandler(me));

module.exports = router;