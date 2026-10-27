const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const COLUMNS = `id, nama, deskripsi, harga_per_kg AS hargaPerKg, estimasi_hari AS estimasiHari, created_at AS createdAt`;

/* =============== READ (all) =============== */
const findAllLayanan = async (search = '') => {
  if (search && search.trim() !== '') {
    const q = `%${search.trim()}%`;
    return await dbAll(
      `SELECT ${COLUMNS} FROM layanan WHERE nama LIKE ? ORDER BY id ASC`,
      [q]
    );
  }
  return await dbAll(`SELECT ${COLUMNS} FROM layanan ORDER BY id ASC`);
};

/* =============== READ (by id) =============== */
const findLayananById = async (id) => {
  return await dbGet(`SELECT ${COLUMNS} FROM layanan WHERE id = ?`, [id]);
};

/* =============== READ (by nama) =============== */
const findLayananByNama = async (nama) => {
  return await dbGet(
    `SELECT ${COLUMNS} FROM layanan WHERE nama = ? COLLATE NOCASE`,
    [nama]
  );
};

/* =============== CREATE =============== */
const createLayanan = async (body) => {
  const query = `
    INSERT INTO layanan (nama, deskripsi, harga_per_kg, estimasi_hari)
    VALUES (?, ?, ?, ?)
  `;
  const values = [
    body.nama,
    body.deskripsi ?? null,
    body.hargaPerKg,
    body.estimasiHari ?? 2,
  ];

  const { lastID } = await dbRun(query, values);
  return await findLayananById(lastID);
};

/* =============== UPDATE =============== */
const updateLayanan = async (id, body) => {
  const existing = await findLayananById(id);
  if (!existing) return null;

  const query = `
    UPDATE layanan
    SET nama = ?, deskripsi = ?, harga_per_kg = ?, estimasi_hari = ?
    WHERE id = ?
  `;
  const values = [
    body.nama ?? existing.nama,
    body.deskripsi !== undefined ? body.deskripsi : existing.deskripsi,
    body.hargaPerKg !== undefined ? body.hargaPerKg : existing.hargaPerKg,
    body.estimasiHari !== undefined ? body.estimasiHari : existing.estimasiHari,
    id,
  ];

  await dbRun(query, values);
  return await findLayananById(id);
};

/* =============== DELETE =============== */
const deleteLayanan = async (id) => {
  const { changes } = await dbRun('DELETE FROM layanan WHERE id = ?', [id]);
  return changes > 0;
};

/* =============== COUNT PESANAN =============== */
const countPesananByLayanan = async (id) => {
  const row = await dbGet('SELECT COUNT(*) AS total FROM pesanan WHERE layanan_id = ?', [id]);
  return row ? row.total : 0;
};

module.exports = {
  findAllLayanan,
  findLayananById,
  findLayananByNama,
  createLayanan,
  updateLayanan,
  deleteLayanan,
  countPesananByLayanan,
};
