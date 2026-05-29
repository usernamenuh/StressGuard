import { Features } from "./landing/Features";
import { FAQ } from "./landing/FAQ";
import { Footer } from "./landing/Footer";

export function LandingPage({ health, onStart }) {
  return (
    <>
    <section className="landing-section" id="home">
      <div className="landing-copy">
        <span className="landing-badge">
          AI Sleep & Stress Companion
        </span>

        <h1>
          Detect stress levels from your sleep habits using AI.
        </h1>

        <p>
          StressGuard membantu membaca kebiasaan tidur, screen time,
          dan kualitas istirahat untuk memberikan prediksi tingkat stres
          serta rekomendasi kesehatan preventif berbasis AI.
        </p>

        <div className="landing-actions">
          <button type="button" className="landing-primary" onClick={onStart}>
            Start Assessment
          </button>

          <a href="#dashboard" className="landing-secondary">
            View Dashboard
          </a>
        </div>
      </div>

      <div className="landing-card">
        <div className="landing-card-header">
          <span>StressGuard AI</span>
          <strong>Live Preview</strong>
        </div>

        <div className="landing-metric-grid">
          <div className="landing-metric metric-blue">
            <span>Sleep</span>
            <strong>5.5h</strong>
          </div>

          <div className="landing-metric metric-yellow">
            <span>Quality</span>
            <strong>4/10</strong>
          </div>

          <div className="landing-metric metric-pink">
            <span>Screen</span>
            <strong>6h</strong>
          </div>
        </div>

        <div className="landing-result-preview">
          <span>Prediksi AI</span>
          <strong>Personalized stress insight</strong>
          <p>
            Model TensorFlow membaca input pengguna, lalu rekomendasi
            kesehatan dibuat dengan Generative AI.
          </p>
        </div>
      </div>

      <div className="landing-feature-row">
        <div className="landing-feature">
          <strong>Machine Learning</strong>
          <span>Prediksi menggunakan model TensorFlow.</span>
        </div>

        <div className="landing-feature">
          <strong>Generative AI</strong>
          <span>Rekomendasi kesehatan lebih personal.</span>
        </div>

        <div className="landing-feature">
          <strong>Dashboard</strong>
          <span>Riwayat dan tren prediksi tersimpan.</span>
        </div>
      </div>
    </section>

    <Features />

    <FAQ />

    <Footer />
    </>
  );
}