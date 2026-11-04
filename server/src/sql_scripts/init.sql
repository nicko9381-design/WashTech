PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS pelanggan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  telepon TEXT NOT NULL UNIQUE,
  alamat TEXT,
  aktif INTEGER NOT NULL DEFAULT 1 CHECK (aktif IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE TABLE IF NOT EXISTS layanan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL UNIQUE COLLATE NOCASE,
  deskripsi TEXT,
  harga_per_kg INTEGER NOT NULL CHECK (harga_per_kg >= 0),
  estimasi_hari INTEGER NOT NULL CHECK (estimasi_hari >= 0),
  aktif INTEGER NOT NULL DEFAULT 1 CHECK (aktif IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE TABLE IF NOT EXISTS pesanan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pelanggan_id INTEGER NOT NULL REFERENCES pelanggan(id),
  layanan_id INTEGER NOT NULL REFERENCES layanan(id),
  berat_kg REAL NOT NULL CHECK (berat_kg > 0),
  total_harga INTEGER NOT NULL CHECK (total_harga >= 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','diterima','diproses','selesai','diambil')),
  catatan TEXT,
  tanggal_masuk TEXT NOT NULL,
  estimasi_selesai TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

-- Seed initial data layanan
INSERT OR IGNORE INTO layanan (id, nama, deskripsi, harga_per_kg, estimasi_hari) VALUES
(1, 'Cuci Kering Reguler', 'Cuci, keringkan, dan lipat rapi', 6000, 3),
(2, 'Cuci + Setrika', 'Cuci bersih lalu disetrika uap', 8000, 3),
(3, 'Setrika Saja', 'Khusus pakaian yang sudah bersih', 5000, 2),
(4, 'Cuci Express (1 Hari)', 'Layanan kilat selesai dalam 1 hari', 12000, 1),
(5, 'Dry Clean (Jas/Gaun)', 'Perawatan khusus bahan sensitif', 25000, 4);

-- Seed initial data pelanggan
INSERT OR IGNORE INTO pelanggan (id, nama, telepon, alamat) VALUES
(1, 'Budi Santoso', '081234567890', 'Jl. Merdeka No. 12, Medan'),
(2, 'Siti Aminah', '081298765432', 'Jl. Sudirman No. 5, Medan'),
(3, 'Andi Pratama', '085277788899', 'Kos Melati Kamar 7, Jl. Setia Budi'),
(4, 'Dewi Lestari', '082111222333', 'Perumahan Griya Asri Blok C3');

-- Seed initial data pesanan
INSERT OR IGNORE INTO pesanan (id, pelanggan_id, layanan_id, berat_kg, total_harga, status, catatan, tanggal_masuk, estimasi_selesai) VALUES
(1, 1, 2, 3.5, 28000, 'diproses', 'Pisahkan baju putih', date('now'), date('now', '+3 days')),
(2, 2, 4, 2.0, 24000, 'selesai', NULL, date('now'), date('now', '+1 days')),
(3, 3, 1, 5.0, 30000, 'diterima', 'Ada noda di kemeja biru', date('now'), date('now', '+3 days')),
(4, 4, 5, 1.5, 37500, 'diproses', 'Jas hitam, hati-hati', date('now'), date('now', '+4 days')),
(5, 1, 3, 2.5, 12500, 'diambil', NULL, date('now'), date('now', '+2 days'));
