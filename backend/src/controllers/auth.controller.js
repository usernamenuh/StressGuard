const {
  registerUser,
  loginUser,
  loginWithGoogle,
  getCurrentUser
} = require("../services/auth.service");

const {
  registerSchema,
  loginSchema,
  googleLoginSchema
} = require("../validators/auth.validator");

async function register(req, res, next) {
  try {
    const payload = registerSchema.parse(req.body);
    const result = await registerUser(payload);

    res.status(201).json({
      success: true,
      message: "Register berhasil.",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await loginUser(payload);

    res.json({
      success: true,
      message: "Login berhasil.",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function googleLogin(req, res, next) {
  try {
    const payload = googleLoginSchema.parse(req.body);

    const result = await loginWithGoogle(payload.idToken);

    res.json({
      success: true,
      message: "Login Google berhasil.",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await getCurrentUser(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  googleLogin,
  me
};