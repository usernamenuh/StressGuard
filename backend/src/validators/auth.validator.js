const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  password: z.string().min(6).max(100)
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6)
});

const googleLoginSchema = z.object({
  idToken: z.string().min(1, "idToken wajib dikirim.")
});

module.exports = {
  registerSchema,
  loginSchema,
  googleLoginSchema
};