const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const COLUMNS = `
  l.id,
  l.nama,
  l.deskripsi,
  l.harga_per_kg AS hargaPerKg,
  l.estimasi_hari AS estimasiHari,
  l.aktif,
  l.created_at AS createdAt,
  (SELECT COUNT(*) FROM pesanan p WHERE p.layanan_id = l.id) AS totalPesanan
`;

/* =============== READ (all) =============== */
const findAllLayanan = async () => {
  return await dbAll(`SELECT ${COLUMNS} FROM layanan l ORDER BY l.id ASC`);
};

/* =============== READ (by id) =============== */
const findLayananById = async (id) => {
  return await dbGet(`SELECT ${COLUMNS} FROM layanan l WHERE l.id = ?`, [id]);
};

/* =============== READ (by nama) =============== */
const findLayananByNama = async (nama) => {
  return await dbGet(
    `SELECT ${COLUMNS} FROM layanan l WHERE l.nama = ? COLLATE NOCASE`,
    [nama]
  );
};

/* =============== CREATE =============== */
const createLayanan = async (body) => {
  const query = `
    INSERT INTO layanan (nama, deskripsi, harga_per_kg, estimasi_hari, aktif)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    body.nama,
    body.deskripsi ?? null,
    body.hargaPerKg,
    body.estimasiHari ?? 2,
    body.aktif !== undefined ? (body.aktif ? 1 : 0) : 1,
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
    SET nama = ?, deskripsi = ?, harga_per_kg = ?, estimasi_hari = ?, aktif = ?
    WHERE id = ?
  `;
  const values = [
    body.nama ?? existing.nama,
    body.deskripsi !== undefined ? body.deskripsi : existing.deskripsi,
    body.hargaPerKg !== undefined ? body.hargaPerKg : existing.hargaPerKg,
    body.estimasiHari !== undefined ? body.estimasiHari : existing.estimasiHari,
    body.aktif !== undefined ? (body.aktif ? 1 : 0) : existing.aktif,
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
