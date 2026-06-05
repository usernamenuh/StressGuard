# StressGuard

StressGuard adalah aplikasi deteksi tingkat stres berbasis pola tidur. Aplikasi ini menggabungkan frontend React, backend Express, dan AI service FastAPI untuk menganalisis data pengguna seperti durasi tidur, kualitas tidur, screen time, dan penggunaan HP sebelum tidur.

Hasil analisis ditampilkan dalam dashboard, riwayat prediksi, serta rekomendasi kesehatan preventif. Aplikasi ini bukan alat diagnosis medis.

## Tampilan Aplikasi

### Landing Page

![Landing Page](image/landing-page.png)

### Login

![Login Page](image/login.png)

### Dashboard Awal

![Dashboard](image/dashboard.png)

### Dashboard Setelah Analisis

![Dashboard Setelah Analisis](image/dashboardsesudah-ada-analis.png)

## Fitur Utama

- Login dengan Google Firebase Authentication.
- Form analisis pola tidur dan kebiasaan screen time.
- Prediksi tingkat stres menggunakan AI service berbasis TensorFlow.
- Rekomendasi kesehatan preventif menggunakan OpenRouter dengan fallback lokal.
- Dashboard ringkasan prediksi.
- Riwayat analisis dan filter tingkat stres.
- Halaman informasi footer seperti About, Privacy, Terms, API Ref, Community, dan Support.
- Support Docker untuk frontend, backend, dan AI service.

## Arsitektur

```text
stressguard/
├── frontend/      # React + Vite + Nginx untuk UI aplikasi
├── backend/       # Express.js API, auth, SQLite, dashboard, history
├── ai_engineer/   # FastAPI + TensorFlow model + OpenRouter recommendation
├── data_science/  # Kumpulan dataset CSV untuk eksplorasi dan training model
└── image/         # Screenshot dokumentasi aplikasi
```

Alur data:

```text
User
  ↓
Frontend React
  ↓
Backend Express API
  ↓
AI Engineer FastAPI
  ↓
Model TensorFlow + rekomendasi AI
  ↓
Backend menyimpan hasil ke SQLite
  ↓
Frontend menampilkan hasil, dashboard, dan riwayat
```

## Tech Stack

Frontend:

- React
- Vite
- React Router
- Axios
- Firebase client
- Tailwind utility dan CSS custom
- Nginx untuk Docker production build

Backend:

- Node.js
- Express.js
- SQLite
- Firebase Admin
- JWT
- bcrypt
- Zod
- Vitest

AI Service:

- Python
- FastAPI
- TensorFlow / Keras
- scikit-learn
- pandas
- joblib
- OpenAI client untuk OpenRouter
- Uvicorn

Data Science:

- Dataset CSV sleep, mental health, lifestyle, dan stress indicator.
- Eksplorasi fitur untuk model prediksi tingkat stres.
- Referensi data untuk proses training dan evaluasi model.

## Struktur dan Berkas Pendukung

Project ini dipisahkan menjadi tiga service utama, yaitu frontend, backend, dan AI service. Setiap service memiliki berkas dependensi dan konfigurasi masing-masing agar proses setup, development, dan deployment lebih mudah dikelola.

Berkas dependensi yang digunakan:

- Frontend: `frontend/package.json` dan `frontend/package-lock.json`.
- Backend: `backend/package.json` dan `backend/package-lock.json`.
- AI service: `ai_engineer/requirements.txt`.

Berkas konfigurasi pendukung:

- Root: `.gitignore`.
- Frontend: `frontend/vite.config.js`, `frontend/jsconfig.json`, `frontend/components.json`, `frontend/nginx.conf`, `frontend/Dockerfile`, `frontend/netlify.toml`, `frontend/vercel.json`, dan `frontend/railway.json`.
- Backend: `backend/Dockerfile`, `backend/vitest.config.js`, `backend/render.yaml`, dan `backend/railway.json`.
- AI service: `ai_engineer/Dockerfile`.

Template environment disediakan agar konfigurasi lokal dapat dibuat tanpa menyimpan credential sensitif di repository:

- Frontend: `frontend/.env.example`.
- Backend: `backend/.env.example`.
- AI service: `ai_engineer/.env.example`.

File `.env` asli digunakan hanya untuk kebutuhan lokal atau deployment dan tidak dicommit ke Git.

## Model Machine Learning

Model Machine Learning yang digunakan pada AI service disimpan terpisah agar repository tetap ringan. Model dapat diunduh melalui folder Google Drive berikut:

- [Folder model StressGuard](https://drive.google.com/drive/folders/1eZvkOW6DfYhESX-YCWf8hGTpDXpNkU7X?usp=sharing)

File model yang digunakan oleh AI service berada di folder `ai_engineer/`:

- `ai_engineer/best_model_gradient_tape.keras`
- `ai_engineer/scaler.pkl`

Kedua file tersebut dimuat oleh `ai_engineer/model_service.py` saat endpoint prediksi dijalankan.

## Data Science

Folder `data_science/` berisi dataset yang digunakan sebagai bahan eksplorasi dan pengembangan model prediksi. Dataset ini menjadi dasar untuk memahami hubungan antara pola tidur, screen time, gaya hidup, kesehatan mental, dan indikator stres.

Isi folder:

```text
data_science/
└── Dataset 3 - sleep_mobile_stress_dataset_15000.csv
```

Peran folder `data_science/`:

- Menyimpan dataset awal untuk analisis dan eksperimen.
- Membantu menentukan fitur input seperti usia, gender, durasi tidur, kualitas tidur, screen time, dan penggunaan HP sebelum tidur.
- Menjadi referensi dalam proses pembuatan model yang digunakan oleh service `ai_engineer/`.
- Memisahkan data eksperimen dari kode aplikasi production agar struktur project tetap rapi.

## Environment Variable

Salin template berikut sebelum menjalankan aplikasi:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp ai_engineer/.env.example ai_engineer/.env
```

### Frontend

Buat file `frontend/.env`.

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Backend

Buat file `backend/.env`.

```env
PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1
FRONTEND_ORIGIN=http://localhost:5173
DB_PATH=./data/stress-detection.sqlite

MODEL_PROVIDER=ai
MODEL_VERSION=tensorflow-gradient-tape-v1
AI_API_URL=http://127.0.0.1:8000/predict

JWT_SECRET=change-this-jwt-secret
JWT_EXPIRES_IN=7d

FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nISI_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

Jika backend berjalan di Docker network yang sama dengan AI service, gunakan:

```env
AI_API_URL=http://ai-engineer:8000/predict
```

### AI Engineer

Buat file `ai_engineer/.env`.

```env
OPENROUTER_API_KEY=isi_api_key_openrouter
PORT=8000
```

Jangan commit file `.env` atau credential apa pun ke Git.

## Menjalankan Secara Lokal

Jalankan AI service:

```bash
cd ai_engineer
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api:app --host 0.0.0.0 --port 8000
```

Jalankan backend:

```bash
cd backend
npm install
npm run dev
```

Jalankan frontend:

```bash
cd frontend
npm install
npm run dev
```

URL lokal:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`
- AI API: `http://localhost:8000`
- AI Swagger Docs: `http://localhost:8000/docs`

## Menjalankan Dengan Docker

Build image:

```bash
docker build -t ai-engineer ./ai_engineer
docker build -t capstone-backend ./backend
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:5000/api/v1 \
  -t capstone-frontend ./frontend
```

Buat network:

```bash
docker network create stressguard-net
```

Jalankan AI service:

```bash
docker run \
  --name ai-engineer \
  --network stressguard-net \
  --env-file ai_engineer/.env \
  -p 8000:8000 \
  ai-engineer
```

Jalankan backend:

```bash
docker run \
  --name capstone-backend \
  --network stressguard-net \
  --env-file backend/.env \
  -p 5000:5000 \
  capstone-backend
```

Jalankan frontend:

```bash
docker run \
  --name capstone-frontend \
  -p 5173:80 \
  capstone-frontend
```

Catatan penting: jika backend berjalan sebagai container, `AI_API_URL` tidak boleh memakai `127.0.0.1:8000`, karena itu akan menunjuk ke container backend sendiri. Gunakan `http://ai-engineer:8000/predict`.

## Endpoint Utama

Backend base URL:

```text
http://localhost:5000/api/v1
```

Endpoint backend:

- `GET /health`: cek status backend dan database.
- `POST /auth/google`: login menggunakan Firebase Google token.
- `GET /auth/me`: mengambil user aktif.
- `GET /meta/form`: metadata field form.
- `POST /predictions`: membuat prediksi baru.
- `GET /predictions`: mengambil riwayat prediksi.
- `GET /predictions/:id`: mengambil detail prediksi.
- `GET /dashboard/summary`: ringkasan dashboard.

AI service base URL:

```text
http://localhost:8000
```

Endpoint AI:

- `GET /`: health check AI service.
- `POST /predict`: prediksi tingkat stres dan rekomendasi.

Contoh request AI:

```json
{
  "age": 21,
  "sleep_hours": 6.5,
  "sleep_quality_score": 7,
  "daily_screen_time_hours": 8,
  "phone_usage_before_sleep_minutes": 120,
  "gender": "male"
}
```

## Testing

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
npm test
```

AI service:

```bash
cd ai_engineer
python -m unittest test_api.py
```

## Troubleshooting

### Backend menampilkan `Internal server error`

Cek log backend:

```bash
docker logs --tail 120 capstone-backend
```

Jika muncul:

```text
getaddrinfo ENOTFOUND ai-engineer
```

Pastikan container AI berada di network yang sama dan memiliki nama atau alias `ai-engineer`.

### Backend tidak bisa akses AI di Docker

Gunakan:

```env
AI_API_URL=http://ai-engineer:8000/predict
```

Jangan gunakan:

```env
AI_API_URL=http://127.0.0.1:8000/predict
```

untuk backend yang berjalan di container.

### Firebase private key gagal diparse

Pastikan `FIREBASE_PRIVATE_KEY` di `backend/.env` ditulis dalam satu baris dengan `\n`.

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nISI_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

### Favicon atau logo belum berubah

Browser sering menyimpan cache favicon. Lakukan hard refresh atau rebuild dan restart container frontend.

## Dokumentasi Tambahan

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [AI Engineer README](ai_engineer/README.md)

## Disclaimer

StressGuard memberikan prediksi dan rekomendasi berbasis data yang dimasukkan pengguna. Hasil aplikasi ini bukan diagnosis medis dan tidak menggantikan konsultasi dengan psikolog, dokter, atau tenaga kesehatan profesional.
