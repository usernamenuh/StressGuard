const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const { HttpError } = require("../utils/http-error");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Token tidak ditemukan.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    throw new HttpError(401, "Token tidak valid atau sudah kedaluwarsa.");
  }
}

module.exports = {
  requireAuth
};