const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const { getDatabase } = require("../db/database");
const { env } = require("../config/env");
const { HttpError } = require("../utils/http-error");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey.replace(/\\n/g, "\n"),
    }),
  });
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  );
}

async function registerUser({ name, email, password }) {
  const db = await getDatabase();

  const existingUser = await db.get(`SELECT id FROM users WHERE email = ?`, [
    email,
  ]);

  if (existingUser) {
    throw new HttpError(409, "Email sudah digunakan.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.run(
    `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES (?, ?, ?)
    `,
    [name, email, passwordHash],
  );

  const user = await db.get(
    `
      SELECT
        id,
        name,
        email,
        created_at AS createdAt
      FROM users
      WHERE id = ?
    `,
    [result.lastID],
  );

  return {
    user,
    token: generateToken(user),
  };
}

async function loginUser({ email, password }) {
  const db = await getDatabase();

  const user = await db.get(
    `
      SELECT *
      FROM users
      WHERE email = ?
    `,
    [email],
  );

  if (!user || !user.password_hash) {
    throw new HttpError(401, "Email atau password salah.");
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new HttpError(401, "Email atau password salah.");
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token: generateToken(user),
  };
}

async function loginWithGoogle(idToken) {
  if (!idToken) {
    throw new HttpError(400, "idToken wajib dikirim.");
  }

  const decoded = await admin.auth().verifyIdToken(idToken);

  if (!decoded.email) {
    throw new HttpError(400, "Akun Google tidak memiliki email.");
  }

  const email = decoded.email;
  const name = decoded.name || email.split("@")[0];

  const db = await getDatabase();

  let user = await db.get(
    `
      SELECT
        id,
        name,
        email,
        created_at AS createdAt
      FROM users
      WHERE email = ?
    `,
    [email],
  );

  if (!user) {
    const result = await db.run(
      `
        INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES (?, ?, ?)
      `,
      [name, email, null],
    );

    user = await db.get(
      `
        SELECT
          id,
          name,
          email,
          created_at AS createdAt
        FROM users
        WHERE id = ?
      `,
      [result.lastID],
    );
  }

  return {
    user,
    token: generateToken(user),
  };
}

async function getCurrentUser(userId) {
  const db = await getDatabase();

  return db.get(
    `
      SELECT
        id,
        name,
        email,
        created_at AS createdAt
      FROM users
      WHERE id = ?
    `,
    [userId],
  );
}

module.exports = {
  registerUser,
  loginUser,
  loginWithGoogle,
  getCurrentUser,
};
