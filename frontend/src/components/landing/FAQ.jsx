export function FAQ() {
  return (
    <section className="landing-cta" id="faq">
      <div className="cta-content">
        <h2 style={{
          color: "#667eea"
        }}>Frequently Asked Questions</h2>
        <p style={{ color: "#4a5568", fontWeight: "500" }}>Punya pertanyaan? Kami siap membantu Anda memahami StressGuard dengan lebih baik.</p>
        
        <div className="faq-list" style={{ marginTop: "30px", textAlign: "left" }}>
          <details style={{ 
            marginBottom: "15px", 
            padding: "18px", 
            border: "1.4px solid rgba(23, 23, 23, 0.06)",
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "0 10px 25px rgba(17, 24, 39, 0.06)",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}>
            <summary style={{ cursor: "pointer", fontWeight: "700", color: "#1a202c" }}>Bagaimana cara StressGuard menganalisis stress level?</summary>
            <p style={{ marginTop: "12px", color: "#4a5568", fontWeight: "500" }}>StressGuard menggunakan machine learning model yang dilatih dengan dataset sleep patterns dan stress indicators. Model kami menganalisis durasi tidur, kualitas tidur, screen time, dan pola aktivitas untuk memberikan prediksi stress level yang akurat.</p>
          </details>

          <details style={{ 
            marginBottom: "15px", 
            padding: "18px", 
            border: "1.4px solid rgba(23, 23, 23, 0.06)",
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "0 10px 25px rgba(17, 24, 39, 0.06)",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}>
            <summary style={{ cursor: "pointer", fontWeight: "700", color: "#1a202c" }}>Apakah data saya aman?</summary>
            <p style={{ marginTop: "12px", color: "#4a5568", fontWeight: "500" }}>Ya, keamanan data Anda adalah prioritas utama kami. Semua data dienkripsi end-to-end dan disimpan di server yang aman. Kami tidak membagikan data Anda kepada pihak ketiga tanpa izin eksplisit dari Anda.</p>
          </details>

          <details style={{ 
            marginBottom: "15px", 
            padding: "18px", 
            border: "1.4px solid rgba(23, 23, 23, 0.06)",
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "0 10px 25px rgba(17, 24, 39, 0.06)",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}>
            <summary style={{ cursor: "pointer", fontWeight: "700", color: "#1a202c" }}>Berapa akurasi prediksi StressGuard?</summary>
            <p style={{ marginTop: "12px", color: "#4a5568", fontWeight: "500" }}>Model kami mencapai tingkat akurasi 95% dalam mendeteksi stress level berdasarkan testing dengan dataset yang beragam. Akurasi dapat bervariasi tergantung pada konsistensi data input dan kondisi individual pengguna.</p>
          </details>

          <details style={{ 
            marginBottom: "15px", 
            padding: "18px", 
            border: "1.4px solid rgba(23, 23, 23, 0.06)",
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "0 10px 25px rgba(17, 24, 39, 0.06)",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}>
            <summary style={{ cursor: "pointer", fontWeight: "700", color: "#1a202c" }}>Apakah ada biaya untuk menggunakan StressGuard?</summary>
            <p style={{ marginTop: "12px", color: "#4a5568", fontWeight: "500" }}>StressGuard menawarkan versi gratis dengan fitur dasar. Untuk fitur premium seperti advanced analytics dan personalized recommendations, kami menawarkan subscription plan yang terjangkau.</p>
          </details>

          <details style={{ 
            marginBottom: "15px", 
            padding: "18px", 
            border: "1.4px solid rgba(23, 23, 23, 0.06)",
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "0 10px 25px rgba(17, 24, 39, 0.06)",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}>
            <summary style={{ cursor: "pointer", fontWeight: "700", color: "#1a202c" }}>Bagaimana cara mendapatkan rekomendasi kesehatan?</summary>
            <p style={{ marginTop: "12px", color: "#4a5568", fontWeight: "500" }}>Setelah memberikan input tentang pola tidur dan aktivitas Anda, AI kami akan menganalisis data dan menghasilkan rekomendasi personal yang disesuaikan dengan kondisi Anda. Rekomendasi ini didasarkan pada penelitian terkini tentang kesehatan dan wellness.</p>
          </details>

          <details style={{ 
            marginBottom: "15px", 
            padding: "18px", 
            border: "1.4px solid rgba(23, 23, 23, 0.06)",
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "0 10px 25px rgba(17, 24, 39, 0.06)",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}>
            <summary style={{ cursor: "pointer", fontWeight: "700", color: "#1a202c" }}>Bisakah saya menggunakan StressGuard di berbagai perangkat?</summary>
            <p style={{ marginTop: "12px", color: "#4a5568", fontWeight: "500" }}>Ya, StressGuard dapat diakses dari berbagai perangkat termasuk desktop, tablet, dan smartphone. Data Anda akan tersinkronisasi otomatis di semua perangkat.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
