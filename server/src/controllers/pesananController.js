const pesananModel = require('../models/pesananModel');
const pelangganModel = require('../models/pelangganModel');
const layananModel = require('../models/layananModel');
const { todayLocal, addDays } = require('../utils/date');
const { success, fail } = require('../utils/response');

const STATUSES = ['draft', 'diterima', 'diproses', 'selesai', 'diambil'];

/* =========================================================
 *  GET /api/pesanan — semua pesanan
 * ========================================================= */
const getAllPesanan = async (req, res) => {
  try {
    const pesanan = await pesananModel.findAllPesanan();
    success(res, 200, 'Berhasil mengambil semua pesanan', pesanan);
  } catch (error) {
    console.error('[getAllPesanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  GET /api/pesanan/:id — satu pesanan
 * ========================================================= */
const getPesananById = async (req, res) => {
  try {
    const { id } = req.params;
    const pesanan = await pesananModel.findPesananById(id);
    if (!pesanan) return fail(res, 404, 'Pesanan tidak ditemukan');

    success(res, 200, 'Berhasil mengambil data pesanan', pesanan);
  } catch (error) {
    console.error('[getPesananById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  POST /api/pesanan — buat pesanan baru
 * ========================================================= */
const createPesanan = async (req, res) => {
  try {
    const { pelangganId, layananId, beratKg, status, catatan, tanggalMasuk } = req.body;

    // Validasi field wajib
    if (!pelangganId || isNaN(pelangganId) || Number(pelangganId) <= 0) {
      return fail(res, 400, 'Validasi gagal', 'pelangganId wajib diisi dan berupa angka valid');
    }
    if (!layananId || isNaN(layananId) || Number(layananId) <= 0) {
      return fail(res, 400, 'Validasi gagal', 'layananId wajib diisi dan berupa angka valid');
    }
    if (beratKg === undefined || beratKg === null || isNaN(beratKg) || Number(beratKg) <= 0) {
      return fail(res, 400, 'Validasi gagal', 'beratKg harus angka > 0');
    }
    // if (!STATUSES.includes(status ?? '')) {
    //   return fail(res, 400, 'Validasi gagal', `status harus salah satu dari: ${STATUSES.join(', ')}`);
    // }

    // Pastikan relasi ada
    const [pelanggan, layanan] = await Promise.all([
      pelangganModel.findPelangganById(pelangganId),
      layananModel.findLayananById(layananId),
    ]);

    if (!pelanggan) return fail(res, 404, 'Pelanggan tidak ditemukan');
    if (!pelanggan.aktif) {
      return fail(res, 400, 'Validasi gagal', `Pelanggan "${pelanggan.nama}" berstatus nonaktif. Hanya pelanggan aktif yang dapat membuat pesanan.`);
    }
    if (!layanan) return fail(res, 404, 'Layanan tidak ditemukan');
    if (!layanan.aktif) {
      return fail(res, 400, 'Validasi gagal', `Layanan "${layanan.nama}" berstatus nonaktif. Hanya layanan aktif yang dapat dipilih.`);
    }

    const berat = Number(beratKg);
    const totalHarga = Math.round(berat * layanan.hargaPerKg);
    const tglMasuk = tanggalMasuk || todayLocal();
    const estimasiSelesai = addDays(tglMasuk, layanan.estimasiHari);

    const created = await pesananModel.createPesanan({
      pelangganId: Number(pelangganId),
      layananId: Number(layananId),
      beratKg: berat,
      totalHarga,
      status: status || 'draft',
      catatan: catatan ? catatan.trim() : null,
      tanggalMasuk: tglMasuk,
      estimasiSelesai,
    });

    success(res, 201, 'Pesanan berhasil dibuat', created);
  } catch (error) {
    console.error('[createPesanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  PUT / PATCH /api/pesanan/:id — update pesanan
 * ========================================================= */
const updatePesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pesananModel.findPesananById(id);
    if (!existing) return fail(res, 404, 'Pesanan tidak ditemukan');

    const { pelangganId, layananId, beratKg, status, catatan, tanggalMasuk } = req.body;

    if (status && !STATUSES.includes(status)) {
      return fail(res, 400, 'Validasi gagal', `status harus salah satu dari: ${STATUSES.join(', ')}`);
    }

    const targetPelangganId = pelangganId !== undefined ? Number(pelangganId) : existing.pelangganId;
    const targetLayananId = layananId !== undefined ? Number(layananId) : existing.layananId;
    const targetBeratKg = beratKg !== undefined ? Number(beratKg) : existing.beratKg;

    if (isNaN(targetBeratKg) || targetBeratKg <= 0) {
      return fail(res, 400, 'Validasi gagal', 'beratKg harus angka > 0');
    }

    // Ambil data layanan bila diperlukan untuk hitung ulang harga & estimasi
    const layanan = await layananModel.findLayananById(targetLayananId);
    if (!layanan) return fail(res, 404, 'Layanan tidak ditemukan');

    const pelanggan = await pelangganModel.findPelangganById(targetPelangganId);
    if (!pelanggan) return fail(res, 404, 'Pelanggan tidak ditemukan');

    const tglMasuk = tanggalMasuk || existing.tanggalMasuk;
    const totalHarga = Math.round(targetBeratKg * layanan.hargaPerKg);
    const estimasiSelesai = addDays(tglMasuk, layanan.estimasiHari);

    const updated = await pesananModel.updatePesanan(id, {
      pelangganId: targetPelangganId,
      layananId: targetLayananId,
      beratKg: targetBeratKg,
      totalHarga,
      status: status ?? existing.status,
      catatan: catatan !== undefined ? (catatan ? catatan.trim() : null) : existing.catatan,
      tanggalMasuk: tglMasuk,
      estimasiSelesai,
    });

    success(res, 200, 'Pesanan berhasil diperbarui', updated);
  } catch (error) {
    console.error('[updatePesanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  DELETE /api/pesanan/:id — hapus pesanan
 * ========================================================= */
const deletePesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pesananModel.findPesananById(id);
    if (!existing) return fail(res, 404, 'Pesanan tidak ditemukan');

    if (existing.status !== 'draft') {
      return fail(
        res,
        400,
        'Hanya pesanan berstatus draft yang dapat dihapus',
        `Pesanan saat ini berstatus "${existing.status}" dan tidak dapat dihapus. Hanya pesanan dengan status "draft" yang dapat dihapus.`
      );
    }

    await pesananModel.deletePesanan(id);
    success(res, 200, 'Pesanan draft berhasil dihapus', { id: Number(id) });
  } catch (error) {
    console.error('[deletePesanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllPesanan,
  getPesananById,
  createPesanan,
  updatePesanan,
  deletePesanan,
};
