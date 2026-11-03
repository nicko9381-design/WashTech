const express = require('express');
const cors = require('cors');

const { initializeDatabase } = require('./src/config/database');
const layananRoutes = require('./src/routes/layananRoutes');
const pelangganRoutes = require('./src/routes/pelangganRoutes')
const { success, fail } = require('./src/utils/response');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  success(res, 200, 'WashTech REST API berjalan', { version: '1.0.0' });
});

// Resource routes
app.use('/api/layanan', layananRoutes);
app.use('/api/pelanggan', pelangganRoutes);

// 404 handler
app.use((req, res) => {
  fail(res, 404, `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  fail(res, 500, 'Terjadi kesalahan pada server', err.message);
});

// Inisialisasi Database & Jalankan Server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 WashTech API berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Gagal inisialisasi database:', err);
    process.exit(1);
  });
