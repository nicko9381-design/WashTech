export interface Layanan {
  id: number
  nama: string
  deskripsi: string | null
  hargaPerKg: number
  estimasiHari: number
  aktif: number | boolean
  totalPesanan?: number
  createdAt: string
}

export interface LayananInput {
  nama: string
  deskripsi: string
  hargaPerKg: number
  estimasiHari: number
  aktif?: number | boolean
}

