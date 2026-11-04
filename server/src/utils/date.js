/** Tanggal hari ini (waktu lokal server) dengan format YYYY-MM-DD. */
const todayLocal = () => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${mm}-${dd}`;
};

/** Menambah `days` hari ke tanggal YYYY-MM-DD, hasilnya YYYY-MM-DD. */
const addDays = (dateText, days) => {
  const [y, m, d] = dateText.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

module.exports = { todayLocal, addDays };
