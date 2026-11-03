const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const COLUMNS = `
  p.id,
  p.nama,
  p.telepon,
  p.alamat,
  p.aktif,
  p.created_at AS createdAt,
  (SELECT COUNT(*) FROM pesanan ps WHERE ps.pelanggan_id = p.id) AS totalPesanan
`;

/* =============== READ (all) =============== */
const findAllPelanggan = async () => {
  return await dbAll(`SELECT ${COLUMNS} FROM pelanggan p ORDER BY p.id DESC`);
};

/* =============== READ (by id) =============== */
const findPelangganById = async (id) => {
  return await dbGet(`SELECT ${COLUMNS} FROM pelanggan p WHERE p.id = ?`, [id]);
};

/* =============== READ (by telepon) =============== */
const findPelangganByTelepon = async (telepon) => {
  return await dbGet(`SELECT ${COLUMNS} FROM pelanggan p WHERE p.telepon = ?`, [telepon]);
};

/* =============== CREATE =============== */
const createPelanggan = async (body) => {
  const query = `
    INSERT INTO pelanggan (nama, telepon, alamat, aktif)
    VALUES (?, ?, ?, ?)
  `;
  const values = [
    body.nama,
    body.telepon,
    body.alamat ?? null,
    body.aktif !== undefined ? (body.aktif ? 1 : 0) : 1,
  ];

  const { lastID } = await dbRun(query, values);
  return await findPelangganById(lastID);
};

/* =============== UPDATE =============== */
const updatePelanggan = async (id, body) => {
  const existing = await findPelangganById(id);
  if (!existing) return null;

  const query = `
    UPDATE pelanggan
    SET nama = ?, telepon = ?, alamat = ?, aktif = ?
    WHERE id = ?
  `;
  const values = [
    body.nama ?? existing.nama,
    body.telepon ?? existing.telepon,
    body.alamat !== undefined ? body.alamat : existing.alamat,
    body.aktif !== undefined ? (body.aktif ? 1 : 0) : existing.aktif,
    id,
  ];

  await dbRun(query, values);
  return await findPelangganById(id);
};

/* =============== DELETE =============== */
const deletePelanggan = async (id) => {
  const { changes } = await dbRun('DELETE FROM pelanggan WHERE id = ?', [id]);
  return changes > 0;
};

/* =============== COUNT PESANAN =============== */
const countPesananByPelanggan = async (id) => {
  const row = await dbGet('SELECT COUNT(*) AS total FROM pesanan WHERE pelanggan_id = ?', [id]);
  return row ? row.total : 0;
};

module.exports = {
  findAllPelanggan,
  findPelangganById,
  findPelangganByTelepon,
  createPelanggan,
  updatePelanggan,
  deletePelanggan,
  countPesananByPelanggan,
};
