import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export async function loginWithGoogle(idToken) {
  const response = await api.post("/auth/google", { idToken });
  return response.data;
}

/* =========================
   AUTO JWT
========================= */

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   ERROR HANDLER
========================= */

function normalizeApiError(
  error,
  fallbackMessage
) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.details ||
      error.message ||
      fallbackMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

/* =========================
   AUTH
========================= */

export async function register(payload) {
  const response =
    await api.post(
      "/auth/register",
      payload
    );

  return response.data;
}

export async function login(payload) {
  const response =
    await api.post(
      "/auth/login",
      payload
    );

  return response.data;
}

export async function getCurrentUser() {
  const response =
    await api.get("/auth/me");

  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
}

/* =========================
   HEALTH
========================= */

export async function healthCheck() {
  const response = await fetch(
    `${API_BASE_URL}/health`,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Backend belum merespons health check."
    );
  }

  return response.json();
}

/* =========================
   META
========================= */

export async function getFormMeta() {
  const response =
    await api.get("/meta/form");

  return response.data;
}

/* =========================
   PREDICTIONS
========================= */

export async function createPrediction(
  payload
) {
  const response =
    await api.post(
      "/predictions",
      payload
    );

  return response.data;
}

export async function getPredictionHistory(
  params = {}
) {
  const response =
    await api.get(
      "/predictions",
      { params }
    );

  return response.data;
}

/* =========================
   DASHBOARD
========================= */

export async function getDashboardSummary() {
  const response =
    await api.get(
      "/dashboard/summary"
    );

  return response.data;
}

export {
  api,
  API_BASE_URL,
  normalizeApiError
};