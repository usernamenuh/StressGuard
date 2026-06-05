# Data Science – StressGuard

Folder ini berisi seluruh pekerjaan role Data Scientist untuk proyek **StressGuard**, yaitu sistem deteksi dini tingkat stres berdasarkan pola tidur, screen time, dan penggunaan mobile. Isi folder mencakup notebook preprocessing dan EDA, dashboard Streamlit, simulasi A/B testing, hasil preprocessing dataset, serta laporan teknis proyek.

## Struktur Folder

```text
Data Science/
│
├── ab_test_outputs/
│   ├── ab_test_data.csv
│   ├── ab_test_results.json
│   └── ab_test_visualization.png
│
├── df3_project_outputs/
│   ├── data_dictionary_df3_future_model.csv
│   ├── data_dictionary_df3_model_ready.csv
│   ├── df3_clean.csv
│   ├── df3_future_model_ready.csv
│   ├── df3_model_ready_.csv
│   ├── df3_model_ready_raw.csv
│   ├── feature_importance_df3_future_model.csv
│   ├── segment_priority_df3_future_model.csv
│   └── target_distribution_df3_future_model.csv
│
├── StressGuard/
├── .gitkeep
├── Dataset 3 - sleep_mobile_stress_dataset_15000.csv
├── ab_testing.py
├── dashboard_streamlit.py
├── laporan_teknis_stressguard.pdf
├── requirements.txt
└── stress_eda_preprocessing.ipynb
```

## Deskripsi File Utama

| File / Folder | Deskripsi |
|---|---|
| `stress_eda_preprocessing.ipynb` | Notebook utama Data Science. Berisi proses data gathering, assessing, cleaning, feature engineering, EDA, pertanyaan bisnis, segmentasi risiko, dataset siap model, dan export hasil analisis. |
| `dashboard_streamlit.py` | Kode dashboard Streamlit untuk menampilkan ringkasan dataset, EDA, segmentasi risiko, risk screening berbasis EDA, insight, dan rekomendasi. |
| `ab_testing.py` | Script A/B testing untuk mensimulasikan efektivitas rekomendasi berbasis segmen risiko terhadap penurunan tingkat stres. |
| `requirements.txt` | Daftar library Python yang dibutuhkan untuk menjalankan dashboard, analisis data, dan A/B testing. |
| `laporan_teknis_stressguard.pdf` | Laporan teknis komprehensif yang merangkum problem discovery, data wrangling, EDA, feature engineering, dashboard, A/B testing, deployment, dan rekomendasi akhir. |
| `StressGuard/` | Folder project aplikasi utama StressGuard. |
| `df3_project_outputs/` | Folder hasil export dari notebook Data Science, termasuk dataset bersih, dataset siap model, data dictionary, feature importance, target distribution, dan segmentasi prioritas. |
| `ab_test_outputs/` | Folder hasil output dari script A/B testing, termasuk data simulasi, ringkasan hasil statistik, dan visualisasi A/B testing. |

## Isi Folder `df3_project_outputs`

| File | Deskripsi |
|---|---|
| `df3_clean.csv` | Dataset 3 yang sudah melalui proses cleaning dan feature engineering. Dataset ini masih lengkap untuk kebutuhan EDA dan analisis lanjutan. |
| `df3_model_ready_raw.csv` | Dataset yang sudah disesuaikan dengan fitur model, tetapi masih dalam bentuk raw agar mudah dicek dan dibaca. |
| `df3_model_ready_.csv` | Dataset siap model hasil preprocessing. File ini digunakan sebagai salah satu output model-ready. |
| `df3_future_model_ready.csv` | Dataset alternatif untuk pengembangan model berikutnya berdasarkan fitur penting dari EDA. |
| `data_dictionary_df3_model_ready.csv` | Data dictionary untuk dataset model-ready. |
| `data_dictionary_df3_future_model.csv` | Data dictionary untuk dataset pengembangan lanjutan. |
| `feature_importance_df3_future_model.csv` | Hasil feature importance dari baseline model untuk melihat fitur yang paling berpengaruh. |
| `target_distribution_df3_future_model.csv` | Ringkasan distribusi target `stress_category`. |
| `segment_priority_df3_future_model.csv` | Ringkasan segmentasi prioritas pengguna berdasarkan risiko stres. |

## Isi Folder `ab_test_outputs`

| File | Deskripsi |
|---|---|
| `ab_test_data.csv` | Data simulasi A/B testing berisi grup kontrol dan treatment, nilai pre-test, post-test, perubahan stres, serta status penurunan kategori stres. |
| `ab_test_results.json` | Ringkasan hasil statistik A/B testing, seperti mean stress, delta mean, p-value, Cohen's d, bootstrap confidence interval, dan improvement rate. |
| `ab_test_visualization.png` | Visualisasi hasil A/B testing, termasuk distribusi stress post-test, pre-test vs post-test, proporsi penurunan kategori stres, bootstrap CI, dan distribusi perubahan stress level. |

## Ringkasan Alur Data Science

1. **Data Gathering**  
   Dataset yang digunakan adalah dataset stress berbasis pola tidur dan penggunaan mobile.

2. **Data Assessing**  
   Pemeriksaan struktur data, missing value, duplikasi, tipe data, statistik deskriptif, dan outlier.

3. **Data Cleaning**  
   Proses meliputi standarisasi nama kolom, penghapusan kolom ID yang tidak digunakan, validasi outlier, dan pengecekan missing value.

4. **Feature Engineering**  
   Membuat fitur turunan seperti:
   - `stress_category`
   - `sleep_quality_category`
   - `phone_usage_before_sleep_category`
   - `daily_screen_time_category`
   - `sleep_deficit_hours`
   - `poor_quality_and_short_sleep`
   - `high_phone_usage_low_sleep`
   - `high_screen_high_fatigue`
   - `priority_segment`

5. **Exploratory Data Analysis (EDA)**  
   EDA digunakan untuk menjawab pertanyaan bisnis terkait faktor yang berhubungan dengan stres, pengaruh screen time, kualitas tidur, kombinasi pola risiko, dan segmentasi pengguna prioritas.

6. **Dataset Siap Model**  
   Dataset disiapkan untuk kebutuhan role AI Engineer dengan encoding fitur kategorikal, scaling fitur numerik, dan encoding target.

7. **Dashboard Streamlit**  
   Dashboard dibuat untuk menampilkan insight data secara interaktif dan membantu stakeholder memahami hasil analisis.

8. **A/B Testing**  
   A/B testing digunakan sebagai simulasi untuk menguji apakah rekomendasi berbasis segmen risiko berpotensi menurunkan tingkat stres pengguna.

## Cara Menjalankan Dashboard Streamlit

Pastikan sudah berada di folder `Data Science`, lalu install library yang dibutuhkan:

```bash
pip install -r requirements.txt
```

Jalankan dashboard:

```bash
python -m streamlit run dashboard_streamlit.py
```

Jika command `streamlit` sudah dikenali oleh terminal, dapat juga menggunakan:

```bash
streamlit run dashboard_streamlit.py
```

## Cara Menjalankan A/B Testing

Jalankan script berikut dari folder `Data Science`:

```bash
python ab_testing.py
```

Output A/B testing akan tersimpan di folder:

```text
ab_test_outputs/
```

## Catatan Penting

- Hasil A/B testing pada tahap ini merupakan simulasi, bukan hasil eksperimen dari pengguna asli.
- Dataset `df3_future_model_ready.csv` digunakan sebagai rekomendasi pengembangan model berikutnya, terutama karena beberapa fitur penting dari EDA belum tersedia sebagai input user pada aplikasi saat ini.
- Dashboard Streamlit lebih difokuskan untuk visualisasi insight, segmentasi risiko, dan screening berbasis EDA.