const { dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const STATUSES = ['draft', 'diterima', 'diproses', 'selesai', 'diambil'];

/* =============== RINGKASAN DASHBOARD =============== */
const getRingkasan = async () => {
  const [pelanggan, layanan, pesanan, perStatusRows] = await Promise.all([
    dbGet('SELECT COUNT(*) AS total FROM pelanggan'),
    dbGet('SELECT COUNT(*) AS total FROM layanan'),
    dbGet('SELECT COUNT(*) AS total, COALESCE(SUM(total_harga), 0) AS pendapatan FROM pesanan'),
    dbAll('SELECT status, COUNT(*) AS total FROM pesanan GROUP BY status'),
  ]);

  const perStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  if (Array.isArray(perStatusRows)) {
    perStatusRows.forEach((r) => {
      perStatus[r.status] = r.total;
    });
  }

  return {
    totalPelanggan: pelanggan ? pelanggan.total : 0,
    totalLayanan: layanan ? layanan.total : 0,
    totalPesanan: pesanan ? pesanan.total : 0,
    totalPendapatan: pesanan ? pesanan.pendapatan : 0,
    pesananPerStatus: perStatus,
  };
};

module.exports = {
  getRingkasan,
  STATUSES,
};

