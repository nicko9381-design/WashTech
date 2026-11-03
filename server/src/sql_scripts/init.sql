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
  status TEXT NOT NULL DEFAULT 'diterima'
    CHECK (status IN ('diterima','diproses','selesai','diambil')),
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