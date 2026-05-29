const { env } = require("../config/env");

async function requestAIPrediction(payload) {
  const response = await fetch(env.aiApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `AI service error ${response.status}: ${errorText}`
    );
  }

  return response.json();
}

module.exports = {
  requestAIPrediction
};