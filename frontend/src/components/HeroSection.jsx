import { API_BASE_URL } from "../lib/api";
import { formatDate, getStressTone } from "../lib/formatters";
import { MeditationIllustration } from "./Illustrations";

export function HeroSection({ health, latestPrediction, onPrimaryClick }) {
  const latestTone = latestPrediction
    ? getStressTone(latestPrediction.stressLevel)
    : "low";

  return (
    <section className="phone-card hero-phone" aria-labelledby="hero-title">
      <div className="phone-toolbar">
        <button type="button" className="icon-button" aria-label="Kembali">
          ←
        </button>
        <div className="sound-pill">
          <span>♫</span>
          Ocean breeze
          <span>⌄</span>
        </div>
      </div>

      <div className="hero-copy">
        <span className="hero-overline">5 minutes</span>
        <h1 id="hero-title">Breathing meditation</h1>
        <p>
          Ritual singkat untuk membaca kondisi tidur, menenangkan ritme napas,
          dan masuk ke asesmen stres dengan nuansa yang lebih lembut.
        </p>
      </div>

      <div className="hero-figure">
        <MeditationIllustration />
      </div>

      <div className="hero-floating-stack">
        <div className="floating-chip">
          <span>Connection</span>
          <strong>{health.online ? "Ready" : "Waiting"}</strong>
        </div>
        <div className={`floating-chip tone-${latestTone}`}>
          <span>Latest insight</span>
          <strong>
            {latestPrediction
              ? `${latestPrediction.stressLevel} • ${latestPrediction.stressScore}%`
              : "No data yet"}
          </strong>
          {latestPrediction ? (
            <>
              <small>{formatDate(latestPrediction.sleepDate)}</small>

              <small>Tidur {latestPrediction.sleepHours} jam</small>
            </>
          ) : null}
        </div>
      </div>

      <div className="hero-footer">
        <div>
          <span className="hero-breath">Inhale...</span>
          <p>{health.message}</p>
        </div>
        <button type="button" className="hero-play" onClick={onPrimaryClick}>
          Start
        </button>
      </div>

      <div className="hero-inline-meta">
        <span>API</span>
        <strong>{API_BASE_URL}</strong>
      </div>
    </section>
  );
}
