import { Brain, Lightbulb, BarChart3 } from 'lucide-react';

export function Features() {
  return (
    <section className="landing-benefits" id="features">
      <h2 style={{
        color: "#667eea"
      }}>Mengapa Memilih StressGuard?</h2>
      <div className="benefits-grid">
        <div className="benefit-card" style={{
          border: "1.4px solid rgba(23, 23, 23, 0.06)",
          background: "#ffffff",
          boxShadow: "0 10px 25px rgba(17, 24, 39, 0.06)"
        }}>
          <div className="benefit-icon blue" style={{
            background: "#f0f5ff",
            boxShadow: "0 8px 20px rgba(102, 126, 234, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Brain size={32} color="#667eea" strokeWidth={1.5} />
          </div>
          <h3 style={{ color: "#1a202c" }}>Analisis Cerdas</h3>
          <p style={{ color: "#4a5568" }}>Machine Learning TensorFlow menganalisis pola tidur dan screen time Anda dengan akurasi tinggi.</p>
        </div>
        <div className="benefit-card" style={{
          border: "1.4px solid rgba(23, 23, 23, 0.06)",
          background: "#ffffff",
          boxShadow: "0 10px 25px rgba(17, 24, 39, 0.06)"
        }}>
          <div className="benefit-icon yellow" style={{
            background: "#f0f5ff",
            boxShadow: "0 8px 20px rgba(102, 126, 234, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Lightbulb size={32} color="#667eea" strokeWidth={1.5} />
          </div>
          <h3 style={{ color: "#1a202c" }}>Rekomendasi Personal</h3>
          <p style={{ color: "#4a5568" }}>Generative AI memberikan saran kesehatan yang disesuaikan dengan kondisi unik Anda.</p>
        </div>
        <div className="benefit-card" style={{
          border: "1.4px solid rgba(23, 23, 23, 0.06)",
          background: "#ffffff",
          boxShadow: "0 10px 25px rgba(17, 24, 39, 0.06)"
        }}>
          <div className="benefit-icon pink" style={{
            background: "#f0f5ff",
            boxShadow: "0 8px 20px rgba(102, 126, 234, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <BarChart3 size={32} color="#667eea" strokeWidth={1.5} />
          </div>
          <h3 style={{ color: "#1a202c" }}>Tracking Tren</h3>
          <p style={{ color: "#4a5568" }}>Dashboard memberikan visualisasi lengkap riwayat prediksi dan perubahan pola kesehatan.</p>
        </div>
      </div>

      <div className="landing-features" style={{ marginTop: "40px" }}>
        <div className="features-content">
          <div className="features-text">
            <h2 style={{
              color: "#667eea"
            }}>Fitur Unggulan</h2>
            <ul className="features-list">
              <li>
                <span className="feature-bullet" style={{
                  background: "#667eea",
                  color: "white"
                }}>✓</span>
                <div>
                  <strong style={{ color: "#1a202c" }}>Sleep Tracking</strong>
                  <p style={{ color: "#4a5568" }}>Monitor durasi dan kualitas tidur harian Anda</p>
                </div>
              </li>
              <li>
                <span className="feature-bullet" style={{
                  background: "#667eea",
                  color: "white"
                }}>✓</span>
                <div>
                  <strong style={{ color: "#1a202c" }}>Screen Time Analysis</strong>
                  <p style={{ color: "#4a5568" }}>Analisis dampak penggunaan gadget terhadap stress</p>
                </div>
              </li>
              <li>
                <span className="feature-bullet" style={{
                  background: "#667eea",
                  color: "white"
                }}>✓</span>
                <div>
                  <strong style={{ color: "#1a202c" }}>Stress Level Prediction</strong>
                  <p style={{ color: "#4a5568" }}>Prediksi akurat tingkat stress dengan AI</p>
                </div>
              </li>
              <li>
                <span className="feature-bullet" style={{
                  background: "#667eea",
                  color: "white"
                }}>✓</span>
                <div>
                  <strong style={{ color: "#1a202c" }}>Health Dashboard</strong>
                  <p style={{ color: "#4a5568" }}>Lihat statistik dan tren kesehatan Anda</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="features-illustration">
            <div className="illustration-card" style={{
              background: "#ffffff",
              border: "1.4px solid rgba(23, 23, 23, 0.06)",
              boxShadow: "0 10px 25px rgba(17, 24, 39, 0.06)"
            }}>
              <div className="chart-bars">
                <div className="bar" style={{height: '30%', background: '#cfe9ff'}} />
                <div className="bar" style={{height: '50%', background: '#bfe4ff'}} />
                <div className="bar" style={{height: '40%', background: '#e8dbff'}} />
                <div className="bar" style={{height: '70%', background: '#bfe9ff'}} />
                <div className="bar" style={{height: '60%', background: '#dfd6ff'}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
