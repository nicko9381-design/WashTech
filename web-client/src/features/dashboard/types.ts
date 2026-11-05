import type { StatusPesanan } from '../pesanan/types'

export interface Ringkasan {
  totalPelanggan: number
  totalLayanan: number
  totalPesanan: number
  totalPendapatan: number
  pesananPerStatus: Record<StatusPesanan, number>
}

