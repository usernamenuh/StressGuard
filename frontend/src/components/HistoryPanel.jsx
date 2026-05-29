import {
  formatConfidence,
  formatDateTime,
  getStressTone,
} from "../lib/formatters";
import { AvatarBadge } from "./Illustrations";

export function HistoryPanel({
  entries,
  meta,
  filter,
  isLoading,
  isPending,
  error,
  onFilterChange,
  onRefresh,
}) {
  const latestEntry = entries[0];
  const headlineNote =
    latestEntry?.notes ||
    "Sometimes it feels like no matter what we do, the body still asks us to slow down first.";

  return (
    <section
      className="phone-card journal-phone"
      id="history"
      aria-labelledby="history-title"
    >
      <div className="journal-topbar">
        <AvatarBadge />
        <button
          type="button"
          className="icon-button"
          onClick={onRefresh}
          aria-label="Muat ulang data"
        >
          ↻
        </button>
      </div>

      <div className="phone-top-copy">
        <span className="section-label">Your expression</span>
        <h2 id="history-title">Journal and prediction history</h2>
        <p>
          Filter level stres, baca catatan terbaru, dan pantau confidence dalam
          tampilan yang lebih personal.
        </p>
      </div>

      <article className="quote-card">
        <p>{headlineNote}</p>
      </article>

      <div className="history-toolbar">
        <label className="toolbar-field">
          <span>Stress level</span>
          <select
            value={filter}
            onChange={(event) => onFilterChange(event.target.value)}
          >
            <option value="">Semua level</option>
            <option value="Rendah">Rendah</option>
            <option value="Sedang">Sedang</option>
            <option value="Tinggi">Tinggi</option>
          </select>
        </label>

        <button type="button" className="ghost-pill" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {error ? <p className="status-message error">{error}</p> : null}

      {isLoading || isPending ? (
        <div className="loading-card">Memuat histori prediksi...</div>
      ) : entries.length === 0 ? (
        <div className="dashboard-empty">
          <strong>Belum ada riwayat untuk filter ini</strong>
          <p>
            Coba lakukan asesmen baru atau ganti filter untuk melihat data yang
            tersimpan di backend.
          </p>
        </div>
      ) : (
        <>
          <div className="journal-grid">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className={`journal-card tone-${getStressTone(entry.stressLevel)}`}
              >
                <div className="history-card-topline">
                  <strong>{entry.stressLevel}</strong>
                  <span>Skor {entry.stressScore}</span>
                </div>

                <p>
                  Tidur {entry.sleepHours} jam · Kualitas{" "}
                  {entry.sleepQualityScore}/10
                </p>

                <p>
                  Screen time {entry.dailyScreenTimeHours} jam · HP sebelum
                  tidur {entry.phoneUsageBeforeSleepMinutes} menit
                </p>

                <p>
                  {entry.notes || "Tidak ada catatan tambahan pada entri ini."}
                </p>

                <div className="journal-meta">
                  <small>{formatDateTime(entry.createdAt)}</small>
                  <small>Confidence {formatConfidence(entry.confidence)}</small>
                </div>
              </article>
            ))}
          </div>

          <div className="journal-footer">
            <span>
              Halaman {meta.page} dari {meta.totalPages}
            </span>
            <span>Total data {meta.total}</span>
          </div>
        </>
      )}
    </section>
  );
}
