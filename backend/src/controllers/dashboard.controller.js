const { getDashboardSummary } = require("../services/dashboard.service");

async function getSummary(req, res) {
  const summary = await getDashboardSummary(req.user.id);

  res.json({
    success: true,
    data: summary
  });
}

module.exports = { getSummary };