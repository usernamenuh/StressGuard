import {
  buildTrendPoints,
  formatDate,
  formatDateTime,
  getDistributionRows,
  getStressTone,
} from "../lib/formatters";

function DashboardEmpty() {
  return (
    <div className="dashboard-empty">
      <strong>Dashboard akan aktif setelah ada prediksi</strong>
      <p>
        Saat riwayat masih kosong, kartu ringkasan, distribusi, dan tren belum
        memiliki data untuk divisualisasikan.
      </p>
    </div>
  );
}

export function DashboardSummary({ summary, isLoading, error }) {
  const rows = getDistributionRows(summary?.distribution);
  const totalDistribution = rows.reduce((sum, row) => sum + row.total, 0);
  const trendPoints = buildTrendPoints(summary?.trend);
  const latestTone = getStressTone(summary?.latestPrediction?.stressLevel);
  const averageScore = Number(summary?.averageStressScore || 0);
  const calendarDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <section
      className="phone-card dashboard-phone"
      id="dashboard"
      aria-labelledby="dashboard-title"
    >
      <div className="calendar-strip" aria-hidden="true">
        {calendarDays.map((day, index) => (
          <div
            key={day}
            className={`calendar-pill ${index === 2 ? "calendar-pill-active" : ""}`}
          >
            <span>{day}</span>
            <strong>{21 + index}</strong>
          </div>
        ))}
      </div>

      <div className="phone-top-copy">
        <span className="section-label">Physical state</span>
        <h2 id="dashboard-title">Daily balance</h2>
        <p>
          Ringkasan ini tetap real-time dari backend, hanya tampil dalam bentuk
          yang lebih mirip wellness dashboard.
        </p>
      </div>

      {error ? <p className="status-message error">{error}</p> : null}

      {isLoading ? (
        <div className="loading-card">Memuat insight terbaru...</div>
      ) : !summary || summary.totalPredictions === 0 ? (
        <DashboardEmpty />
      ) : (
        <>
          <div className="dashboard-feature-grid">
            <div className="feature-card feature-card-pink">
              <span>Total check-ins</span>
              <strong>{summary.totalPredictions} sesi</strong>
            </div>
            <div className="feature-card feature-card-blue">
              <span>Average score</span>
              <strong>{summary.averageStressScore}</strong>
            </div>
            <div
              className={`feature-card feature-card-yellow tone-${latestTone}`}
            >
              <span>Latest tone</span>
              <strong>{summary.latestPrediction?.stressLevel || "-"}</strong>
              <small>{formatDate(summary.latestPrediction?.sleepDate)}</small>
            </div>
          </div>

          <div className="dashboard-body">
            <div className="distribution-card">
              <div className="distribution-header">
                <h3>Distribution</h3>
                <span>{totalDistribution} entri</span>
              </div>
              <div className="distribution-list">
                {rows.map((row) => {
                  const percentage = totalDistribution
                    ? Math.round((row.total / totalDistribution) * 100)
                    : 0;

                  return (
                    <div key={row.level} className="distribution-item">
                      <div className="distribution-topline">
                        <span>{row.level}</span>
                        <strong>{percentage}%</strong>
                      </div>
                      <div className="distribution-track">
                        <span
                          className={`distribution-fill tone-${row.tone}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="donut-card">
              <div
                className="result-gauge dashboard-gauge"
                style={{ "--score": `${averageScore}%` }}
              >
                <div className="result-gauge-inner">
                  <strong>{Math.round(averageScore)}%</strong>
                  <span>Balance</span>
                </div>
              </div>
            </div>
          </div>

          <div className="trend-card">
            <div className="distribution-header">
              <h3>Tren 7 hari terakhir</h3>
              <span>Rata-rata skor harian</span>
            </div>
            {summary.trend?.length ? (
              <>
                <svg
                  className="trend-chart"
                  viewBox="0 0 360 180"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="trendStroke" x1="0" x2="1">
                      <stop offset="0%" stopColor="#fd8de5" />
                      <stop offset="100%" stopColor="#9be9ff" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="url(#trendStroke)"
                    strokeWidth="5"
                    points={trendPoints}
                  />
                </svg>

                <div className="trend-labels">
                  {summary.trend.map((entry) => (
                    <div key={entry.sleepDate} className="trend-label-item">
                      <span>{formatDate(entry.sleepDate)}</span>
                      <strong>{entry.averageStressScore}</strong>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <DashboardEmpty />
            )}
          </div>

          <div className="recent-card-board">
            <div className="distribution-header">
              <h3>Prediksi terbaru</h3>
              <span>5 entri terakhir</span>
            </div>
            <div className="recent-grid">
              {summary.recentPredictions.map((item) => (
                <article
                  key={item.id}
                  className={`recent-card tone-${getStressTone(item.stressLevel)}`}
                >
                  <div className="recent-topline">
                    <strong>{item.stressLevel}</strong>
                    <span>Skor {item.stressScore}</span>
                  </div>
                  <p>
                    Tidur {item.sleepHours} jam · Kualitas{" "}
                    {item.sleepQualityScore}/10
                  </p>

                  <p>Screen time {item.dailyScreenTimeHours} jam</p>

                  <small>{formatDateTime(item.createdAt)}</small>
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
