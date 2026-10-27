PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS pelanggan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  telepon TEXT NOT NULL UNIQUE,
  alamat TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE TABLE IF NOT EXISTS layanan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL UNIQUE COLLATE NOCASE,
  deskripsi TEXT,
  harga_per_kg INTEGER NOT NULL CHECK (harga_per_kg >= 0),
  estimasi_hari INTEGER NOT NULL CHECK (estimasi_hari >= 0),
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
