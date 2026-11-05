export type StatusPesanan = 'draft' | 'diterima' | 'diproses' | 'selesai' | 'diambil'

export interface Pesanan {
  id: number
  kode?: string | number
  pelangganId: number
  pelangganNama: string
  pelangganTelepon: string
  layananId: number
  layananNama: string
  beratKg: number
  totalHarga: number
  status: StatusPesanan
  catatan: string | null
  tanggalMasuk: string
  estimasiSelesai: string
  createdAt: string
  updatedAt: string
}

export const STATUS_LIST: { value: StatusPesanan; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'diterima', label: 'Diterima' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'diambil', label: 'Diambil' },
]

export const statusColorMap: Record<StatusPesanan, string> = {
  draft: 'purple',
  diterima: 'blue',
  diproses: 'gold',
  selesai: 'green',
  diambil: 'default',
}

