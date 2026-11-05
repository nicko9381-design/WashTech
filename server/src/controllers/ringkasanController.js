const ringkasanModel = require('../models/ringkasanModel');
const { success, fail } = require('../utils/response');

/* =========================================================
 *  GET /api/ringkasan — data ringkasan dashboard
 * ========================================================= */
const getRingkasan = async (req, res) => {
  try {
    const ringkasan = await ringkasanModel.getRingkasan();
    success(res, 200, 'Ringkasan berhasil diambil', ringkasan);
  } catch (error) {
    console.error('[getRingkasan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getRingkasan,
};
