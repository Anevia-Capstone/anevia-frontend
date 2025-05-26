# Anevia - Deteksi Anemia Berbasis AI

Anevia adalah aplikasi web Single Page Application (SPA) untuk mendeteksi anemia melalui pemindaian mata tanpa invasif menggunakan teknologi AI. Aplikasi ini menyediakan cara yang cepat, mudah, dan non-invasif untuk skrining anemia tanpa perlu tes darah konvensional.

## 🚀 Fitur Utama

### Deteksi Anemia

- **Pemindaian mata non-invasif** menggunakan teknologi AI
- **Integrasi kamera real-time** untuk mengambil gambar mata
- **Upload gambar** untuk analisis offline
- **Hasil skrining instan** dengan tingkat kepercayaan
- **Laporan hasil** yang dapat diunduh dalam format teks

### Autentikasi & Profil Pengguna

- **Autentikasi Firebase** dengan email/password dan Google Sign-in
- **Manajemen profil pengguna** lengkap
- **Upload foto profil** dengan integrasi backend
- **Riwayat pemindaian** untuk setiap pengguna
- **Keamanan token** dengan refresh otomatis

### Antarmuka & Pengalaman Pengguna

- **Desain responsif** untuk desktop dan mobile
- **Hash-based routing** untuk navigasi SPA yang smooth
- **Arsitektur MVP** (Model-View-Presenter) untuk maintainability
- **Real-time feedback** selama proses pemindaian
- **Loading states** dan error handling yang komprehensif

## 🛠️ Teknologi & Arsitektur

### Frontend Stack

- **JavaScript ES6+** (Vanilla, no framework dependencies)
- **Vite** - Build tool dan development server
- **CSS3** dengan custom properties dan responsive design
- **Web APIs** - getUserMedia, File API, Canvas API

### Backend Integration

- **Firebase Authentication** - Manajemen autentikasi pengguna
- **Axios** - HTTP client untuk komunikasi dengan backend
- **REST API** - Integrasi dengan server.anevia.my.id

### Arsitektur

- **MVP Pattern** - Model-View-Presenter untuk separation of concerns
- **Hash-based Routing** - Single Page Application navigation
- **Component-based** - Reusable UI components
- **Event-driven** - Custom events untuk komunikasi antar komponen

## 📦 Instalasi & Setup

### Prasyarat

- **Node.js** (versi 16 atau lebih baru)
- **npm** atau **yarn**
- **Browser modern** dengan dukungan getUserMedia API

### Langkah Instalasi

1. **Clone repository:**

   ```bash
   git clone https://github.com/yourusername/anevia-frontend-main.git
   cd anevia-frontend-main
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Konfigurasi Firebase:**

   - Pastikan konfigurasi Firebase di `src/js/firebase/config.js` sudah sesuai
   - API Key yang digunakan: `AIzaSyBjL0vu0fiAWZVx125Hldqnk1HmSMuM65o`

4. **Jalankan development server:**

   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:5173`

5. **Build untuk production:**

   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🎯 Cara Penggunaan

### Deteksi Anemia

1. **Akses Tools:**

   - Navigasi ke halaman "Tools" melalui menu atau URL `#tools`
   - Login terlebih dahulu jika diperlukan untuk menyimpan riwayat

2. **Pilih Mode Pemindaian:**

   - **Kamera:** Gunakan kamera device untuk real-time capture
   - **Upload:** Upload gambar mata yang sudah ada

3. **Proses Pemindaian:**

   - Ikuti petunjuk positioning mata yang optimal
   - Pastikan pencahayaan yang cukup
   - Ambil gambar atau upload file (JPG, PNG, max 10MB)

4. **Hasil Analisis:**
   - Lihat hasil deteksi dengan tingkat kepercayaan
   - Baca rekomendasi yang diberikan sistem
   - Download laporan hasil dalam format teks

### Manajemen Akun

1. **Registrasi:**

   - Klik "Sign Up" di navigation
   - Daftar dengan email/password atau Google Account
   - Verifikasi akan dilakukan otomatis melalui Firebase

2. **Login:**

   - Klik "Login" di navigation
   - Masuk dengan kredensial yang sudah terdaftar
   - Token akan di-refresh otomatis untuk keamanan

3. **Profil Pengguna:**
   - Akses halaman profil melalui menu user
   - Update informasi personal
   - Upload foto profil
   - Lihat riwayat pemindaian

## 📁 Struktur Proyek

```
anevia-frontend-main/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/                 # Asset statis (gambar, ikon)
│   │   ├── default-avatar.svg
│   │   ├── eye-placeholder.svg
│   │   ├── favicon.svg
│   │   ├── hero-bg.jpg
│   │   ├── logo.svg
│   │   └── team-placeholder.svg
│   ├── css/
│   │   └── styles.css         # Stylesheet utama
│   ├── js/
│   │   ├── api.js            # Integrasi API backend
│   │   ├── components/       # Komponen UI reusable
│   │   │   ├── Footer.js
│   │   │   ├── Navigation.js
│   │   │   └── UserProfile.js
│   │   ├── firebase/         # Konfigurasi Firebase
│   │   │   ├── auth.js
│   │   │   └── config.js
│   │   ├── models/           # Data models (MVP pattern)
│   │   │   ├── BaseModel.js
│   │   │   ├── ProfileModel.js
│   │   │   ├── ToolsModel.js
│   │   │   └── UserModel.js
│   │   ├── presenters/       # Business logic (MVP pattern)
│   │   │   ├── BasePresenter.js
│   │   │   ├── HomePresenter.js
│   │   │   ├── LoginPresenter.js
│   │   │   ├── ProfilePresenter.js
│   │   │   ├── RegisterPresenter.js
│   │   │   └── ToolsPresenter.js
│   │   ├── router/           # Hash-based routing
│   │   │   └── Router.js
│   │   ├── utils/            # Utility functions
│   │   │   ├── camera.js
│   │   │   └── fileUpload.js
│   │   └── views/            # UI views (MVP pattern)
│   │       ├── BaseView.js
│   │       ├── HomeView.js
│   │       ├── LoginView.js
│   │       ├── ProfileView.js
│   │       ├── RegisterView.js
│   │       └── ToolsView.js
│   └── main.js               # Entry point aplikasi
├── index.html                # HTML template utama
├── package.json              # Dependencies dan scripts
├── package-lock.json
└── README.md
```

## 🔌 API Integration

### Backend Server

- **Base URL:** `https://server.anevia.my.id`
- **API Endpoint:** `https://server.anevia.my.id/api`

### Endpoints yang Digunakan

#### Autentikasi

- `POST /api/auth/verify` - Verifikasi Firebase token
- `GET /api/auth/refresh` - Refresh token
- `GET /api/users/{uid}` - Get user profile

#### Pemindaian Anemia

- `POST /api/scans` - Upload gambar untuk deteksi
- `GET /api/scans` - Get riwayat pemindaian user
- `GET /api/scans/{id}` - Get detail pemindaian

#### Profil Pengguna

- `PUT /api/users/{uid}` - Update profil user
- `POST /api/users/{uid}/avatar` - Upload foto profil
- `DELETE /api/users/{uid}` - Hapus akun user

### Authentication

Semua request ke backend menggunakan Firebase ID Token dalam header:

```
Authorization: Bearer <firebase-id-token>
```

## 👥 Tim Pengembang

### Machine Learning Team

- **Yonathan Tirza K.** - Team Leader & ML Engineer
- **Dearni Lambardo S.** - ML Engineer
- **Wiefran Varenzo** - ML Engineer

### Full-Stack Development Team

- **Rayina Ilham** - Frontend & Backend Developer
- **Muhammad Irza A.** - Frontend & Backend Developer
- **Oatse Rizqy H.** - Frontend & Backend Developer

## 🚀 Deployment

### Development

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

### Environment Variables

Pastikan konfigurasi Firebase sudah sesuai di `src/js/firebase/config.js`

## 🧪 Testing & Development

### Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Development Guidelines

#### Code Style

- Gunakan ES6+ features
- Implementasi MVP pattern untuk semua fitur baru
- Gunakan event-driven architecture untuk komunikasi komponen
- Pastikan responsive design untuk semua screen sizes

#### File Naming Convention

- **Views:** `[Name]View.js` (PascalCase)
- **Presenters:** `[Name]Presenter.js` (PascalCase)
- **Models:** `[Name]Model.js` (PascalCase)
- **Components:** `[Name].js` (PascalCase)
- **Utils:** `[name].js` (camelCase)

#### Adding New Features

1. Buat Model di `src/js/models/`
2. Buat View di `src/js/views/`
3. Buat Presenter di `src/js/presenters/`
4. Daftarkan route di `src/main.js`
5. Update navigation jika diperlukan

### Testing

```bash
# Manual testing dengan development server
npm run dev

# Build testing
npm run build
npm run preview
```

## 🔧 Troubleshooting

### Common Issues

#### Camera tidak berfungsi

- Pastikan browser mendukung getUserMedia API
- Periksa permission kamera di browser
- Gunakan HTTPS untuk production

#### Firebase Authentication Error

- Periksa konfigurasi Firebase di `config.js`
- Pastikan API key masih valid
- Cek network connectivity

#### Build Error

- Hapus `node_modules` dan `package-lock.json`
- Jalankan `npm install` ulang
- Pastikan Node.js versi 16+

## 📄 License

Project ini dikembangkan untuk keperluan akademik dalam program Dicoding.

**Anevia** - Deteksi Anemia Berbasis AI untuk Kesehatan yang Lebih Baik 🩺✨
