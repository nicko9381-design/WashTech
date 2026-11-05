export interface Pelanggan {
  id: number
  nama: string
  telepon: string
  alamat: string | null
  aktif: number | boolean
  totalPesanan?: number
  createdAt: string
}
