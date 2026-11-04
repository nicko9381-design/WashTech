const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const SELECT_PESANAN = `
  SELECT
    p.id,
    p.id                         AS kode,
    p.pelanggan_id               AS pelangganId,
    pl.nama                      AS pelangganNama,
    pl.telepon                   AS pelangganTelepon,
    p.layanan_id                 AS layananId,
    l.nama                       AS layananNama,
    p.berat_kg                   AS beratKg,
    p.total_harga                AS totalHarga,
    p.status,
    p.catatan,
    p.tanggal_masuk              AS tanggalMasuk,
    p.estimasi_selesai           AS estimasiSelesai,
    p.created_at                 AS createdAt,
    p.updated_at                 AS updatedAt
  FROM pesanan p
  JOIN pelanggan pl ON pl.id = p.pelanggan_id
  JOIN layanan   l  ON l.id  = p.layanan_id
`;

/* =============== READ (all) =============== */
const findAllPesanan = async () => {
  return await dbAll(`${SELECT_PESANAN} ORDER BY p.id DESC`);
};

/* =============== READ (by id) =============== */
const findPesananById = async (id) => {
  return await dbGet(`${SELECT_PESANAN} WHERE p.id = ?`, [id]);
};

/* =============== CREATE =============== */
const createPesanan = async (body) => {
  const query = `
    INSERT INTO pesanan (
      pelanggan_id,
      layanan_id,
      berat_kg,
      total_harga,
      status,
      catatan,
      tanggal_masuk,
      estimasi_selesai
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    body.pelangganId,
    body.layananId,
    body.beratKg,
    body.totalHarga,
    body.status || 'draft',
    body.catatan ?? null,
    body.tanggalMasuk,
    body.estimasiSelesai,
  ];

  const { lastID } = await dbRun(query, values);
  return await findPesananById(lastID);
};

/* =============== UPDATE =============== */
const updatePesanan = async (id, body) => {
  const existing = await findPesananById(id);
  if (!existing) return null;

  const query = `
    UPDATE pesanan
    SET pelanggan_id = ?,
        layanan_id = ?,
        berat_kg = ?,
        total_harga = ?,
        status = ?,
        catatan = ?,
        tanggal_masuk = ?,
        estimasi_selesai = ?,
        updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now')
    WHERE id = ?
  `;
  const values = [
    body.pelangganId ?? existing.pelangganId,
    body.layananId ?? existing.layananId,
    body.beratKg ?? existing.beratKg,
    body.totalHarga ?? existing.totalHarga,
    body.status ?? existing.status,
    body.catatan !== undefined ? body.catatan : existing.catatan,
    body.tanggalMasuk ?? existing.tanggalMasuk,
    body.estimasiSelesai ?? existing.estimasiSelesai,
    id,
  ];

  await dbRun(query, values);
  return await findPesananById(id);
};

/* =============== DELETE =============== */
const deletePesanan = async (id) => {
  const { changes } = await dbRun('DELETE FROM pesanan WHERE id = ?', [id]);
  return changes > 0;
};

module.exports = {
  findAllPesanan,
  findPesananById,
  createPesanan,
  updatePesanan,
  deletePesanan,
};

