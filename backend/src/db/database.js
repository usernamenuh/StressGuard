const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const { env } = require("../config/env");

let database;

async function initializeDatabase() {
  if (database) {
    return database;
  }

  fs.mkdirSync(path.dirname(env.dbPath), { recursive: true });

  database = await open({
    filename: env.dbPath,
    driver: sqlite3.Database,
  });

  await database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    sleep_date TEXT NOT NULL,

    age INTEGER NOT NULL,

    gender TEXT NOT NULL,

    sleep_hours REAL NOT NULL,

    sleep_quality_score REAL NOT NULL,

    daily_screen_time_hours REAL NOT NULL,

    phone_usage_before_sleep_minutes INTEGER NOT NULL,

    notes TEXT,

    stress_score INTEGER NOT NULL,

    stress_level TEXT NOT NULL,

    confidence REAL NOT NULL,

    recommendations TEXT NOT NULL,

    model_provider TEXT NOT NULL,

    model_version TEXT NOT NULL,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_predictions_user_id
    ON predictions(user_id);

  CREATE INDEX IF NOT EXISTS idx_predictions_created_at
    ON predictions(created_at DESC);

  CREATE INDEX IF NOT EXISTS idx_predictions_stress_level
    ON predictions(stress_level);
`);

  return database;
}

async function getDatabase() {
  if (!database) {
    await initializeDatabase();
  }

  return database;
}

async function closeDatabase() {
  if (database) {
    await database.close();

    database = null;
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
};
