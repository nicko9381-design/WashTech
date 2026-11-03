const pelangganModel = require('../models/pelangganModel');
const { success, fail } = require('../utils/response');

/* =========================================================
 *  GET /api/pelanggan — semua pelanggan
 * ========================================================= */
const getAllPelanggan = async (req, res) => {
  try {
    const pelanggan = await pelangganModel.findAllPelanggan();
    success(res, 200, 'Berhasil mengambil semua pelanggan', pelanggan);
  } catch (error) {
    console.error('[getAllPelanggan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  GET /api/pelanggan/:id — satu pelanggan
 * ========================================================= */
const getPelangganById = async (req, res) => {
  try {
    const { id } = req.params;
    const pelanggan = await pelangganModel.findPelangganById(id);
    if (!pelanggan) return fail(res, 404, 'Pelanggan tidak ditemukan');

    success(res, 200, 'Berhasil mengambil data pelanggan', pelanggan);
  } catch (error) {
    console.error('[getPelangganById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  POST /api/pelanggan — buat pelanggan baru
 * ========================================================= */
const createPelanggan = async (req, res) => {
  try {
    const { nama, telepon, alamat, aktif } = req.body;

    // Validasi input
    if (!nama || typeof nama !== 'string' || nama.trim().length < 2) {
      return fail(res, 400, 'Validasi gagal', 'nama wajib diisi minimal 2 karakter');
    }
    if (!telepon || typeof telepon !== 'string' || !/^\+?[0-9]{8,15}$/.test(telepon.trim())) {
      return fail(res, 400, 'Validasi gagal', 'telepon harus 8-15 digit angka (boleh diawali +)');
    }

    // Cek duplikasi nomor telepon
    const existing = await pelangganModel.findPelangganByTelepon(telepon.trim());
    if (existing) {
      return fail(res, 409, 'Nomor telepon sudah terdaftar', `Nomor ${telepon} sudah dipakai pelanggan "${existing.nama}"`);
    }

    const created = await pelangganModel.createPelanggan({
      nama: nama.trim(),
      telepon: telepon.trim(),
      alamat: alamat ? alamat.trim() : null,
      aktif: aktif !== undefined ? (aktif ? 1 : 0) : 1,
    });

    success(res, 201, 'Pelanggan berhasil ditambahkan', created);
  } catch (error) {
    console.error('[createPelanggan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  PUT / PATCH /api/pelanggan/:id — update pelanggan
 * ========================================================= */
const updatePelanggan = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pelangganModel.findPelangganById(id);
    if (!existing) return fail(res, 404, 'Pelanggan tidak ditemukan');

    const { nama, telepon, alamat, aktif } = req.body;

    if (nama !== undefined && (typeof nama !== 'string' || nama.trim().length < 2)) {
      return fail(res, 400, 'Validasi gagal', 'nama harus minimal 2 karakter');
    }
    if (telepon !== undefined && (typeof telepon !== 'string' || !/^\+?[0-9]{8,15}$/.test(telepon.trim()))) {
      return fail(res, 400, 'Validasi gagal', 'telepon harus 8-15 digit angka (boleh diawali +)');
    }

    if (telepon) {
      const dupe = await pelangganModel.findPelangganByTelepon(telepon.trim());
      if (dupe && String(dupe.id) !== String(id)) {
        return fail(res, 409, 'Nomor telepon sudah terdaftar', `Nomor ${telepon} sudah dipakai pelanggan "${dupe.nama}"`);
      }
    }

    const updated = await pelangganModel.updatePelanggan(id, {
      nama: nama !== undefined ? nama.trim() : existing.nama,
      telepon: telepon !== undefined ? telepon.trim() : existing.telepon,
      alamat: alamat !== undefined ? (alamat ? alamat.trim() : null) : existing.alamat,
      aktif: aktif !== undefined ? (aktif ? 1 : 0) : existing.aktif,
    });

    success(res, 200, 'Pelanggan berhasil diperbarui', updated);
  } catch (error) {
    console.error('[updatePelanggan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  DELETE /api/pelanggan/:id — hapus pelanggan
 * ========================================================= */
const deletePelanggan = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pelangganModel.findPelangganById(id);
    if (!existing) return fail(res, 404, 'Pelanggan tidak ditemukan');

    const pesananCount = await pelangganModel.countPesananByPelanggan(id);
    if (pesananCount > 0) {
      return fail(
        res,
        409,
        'Pelanggan tidak bisa dihapus',
        `Pelanggan ini sudah memiliki ${pesananCount} transaksi pesanan. Silakan nonaktifkan pelanggan jika sudah tidak aktif.`
      );
    }

    await pelangganModel.deletePelanggan(id);
    success(res, 200, 'Pelanggan berhasil dihapus', { id: Number(id) });
  } catch (error) {
    console.error('[deletePelanggan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllPelanggan,
  getPelangganById,
  createPelanggan,
  updatePelanggan,
  deletePelanggan,
};
