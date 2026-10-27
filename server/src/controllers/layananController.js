const layananModel = require('../models/layananModel');
const { success, fail } = require('../utils/response');

/* =========================================================
 *  GET /api/layanan — semua layanan (bisa ?search=)
 * ========================================================= */
const getAllLayanan = async (req, res) => {
  try {
    const { search } = req.query;
    const layanan = await layananModel.findAllLayanan(search);
    success(res, 200, 'Berhasil mengambil semua layanan', layanan);
  } catch (error) {
    console.error('[getAllLayanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  GET /api/layanan/:id — satu layanan
 * ========================================================= */
const getLayananById = async (req, res) => {
  try {
    const { id } = req.params;
    const layanan = await layananModel.findLayananById(id);
    if (!layanan) return fail(res, 404, 'Layanan tidak ditemukan');

    success(res, 200, 'Berhasil mengambil data layanan', layanan);
  } catch (error) {
    console.error('[getLayananById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  POST /api/layanan — buat layanan baru
 * ========================================================= */
const createLayanan = async (req, res) => {
  try {
    const { nama, deskripsi, hargaPerKg, estimasiHari } = req.body;

    // Validasi input
    if (!nama || typeof nama !== 'string' || nama.trim().length < 2) {
      return fail(res, 400, 'Validasi gagal', 'nama layanan wajib diisi minimal 2 karakter');
    }
    if (hargaPerKg === undefined || hargaPerKg === null || isNaN(hargaPerKg) || Number(hargaPerKg) < 0) {
      return fail(res, 400, 'Validasi gagal', 'hargaPerKg harus angka >= 0');
    }
    if (estimasiHari !== undefined && (isNaN(estimasiHari) || Number(estimasiHari) < 0)) {
      return fail(res, 400, 'Validasi gagal', 'estimasiHari harus angka >= 0');
    }

    // Cek duplikasi nama layanan
    const dupe = await layananModel.findLayananByNama(nama.trim());
    if (dupe) {
      return fail(res, 409, 'Nama layanan sudah ada', `Layanan "${dupe.nama}" sudah terdaftar`);
    }

    const created = await layananModel.createLayanan({
      nama: nama.trim(),
      deskripsi: deskripsi ? deskripsi.trim() : null,
      hargaPerKg: Math.round(Number(hargaPerKg)),
      estimasiHari: estimasiHari !== undefined ? Number(estimasiHari) : 2,
    });

    success(res, 201, 'Layanan berhasil ditambahkan', created);
  } catch (error) {
    console.error('[createLayanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  PUT / PATCH /api/layanan/:id — update layanan
 * ========================================================= */
const updateLayanan = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await layananModel.findLayananById(id);
    if (!existing) return fail(res, 404, 'Layanan tidak ditemukan');

    const { nama, deskripsi, hargaPerKg, estimasiHari } = req.body;

    if (nama !== undefined && (typeof nama !== 'string' || nama.trim().length < 2)) {
      return fail(res, 400, 'Validasi gagal', 'nama layanan minimal 2 karakter');
    }
    if (nama) {
      const dupe = await layananModel.findLayananByNama(nama.trim());
      if (dupe && String(dupe.id) !== String(id)) {
        return fail(res, 409, 'Nama layanan sudah ada', `Layanan "${dupe.nama}" sudah terdaftar`);
      }
    }
    if (hargaPerKg !== undefined && (isNaN(hargaPerKg) || Number(hargaPerKg) < 0)) {
      return fail(res, 400, 'Validasi gagal', 'hargaPerKg harus angka >= 0');
    }
    if (estimasiHari !== undefined && (isNaN(estimasiHari) || Number(estimasiHari) < 0)) {
      return fail(res, 400, 'Validasi gagal', 'estimasiHari harus angka >= 0');
    }

    const updated = await layananModel.updateLayanan(id, {
      nama: nama !== undefined ? nama.trim() : existing.nama,
      deskripsi: deskripsi !== undefined ? (deskripsi ? deskripsi.trim() : null) : existing.deskripsi,
      hargaPerKg: hargaPerKg !== undefined ? Math.round(Number(hargaPerKg)) : existing.hargaPerKg,
      estimasiHari: estimasiHari !== undefined ? Number(estimasiHari) : existing.estimasiHari,
    });

    success(res, 200, 'Layanan berhasil diperbarui', updated);
  } catch (error) {
    console.error('[updateLayanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  DELETE /api/layanan/:id — hapus layanan
 * ========================================================= */
const deleteLayanan = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await layananModel.findLayananById(id);
    if (!existing) return fail(res, 404, 'Layanan tidak ditemukan');

    const pesananCount = await layananModel.countPesananByLayanan(id);
    if (pesananCount > 0) {
      return fail(res, 409, 'Layanan tidak bisa dihapus', `Masih dipakai di ${pesananCount} pesanan`);
    }

    await layananModel.deleteLayanan(id);
    success(res, 200, 'Layanan berhasil dihapus', { id: Number(id) });
  } catch (error) {
    console.error('[deleteLayanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllLayanan,
  getLayananById,
  createLayanan,
  updateLayanan,
  deleteLayanan,
};