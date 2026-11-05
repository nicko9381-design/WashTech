import type { Ringkasan } from '../types'
import { formatRupiah } from '../../../shared/utils/format'

interface DashboardStatsProps {
  ringkasan: Ringkasan
  aktif: number
}

export default function DashboardStats({ ringkasan: r, aktif }: DashboardStatsProps) {
  return (
    <div className="stat-grid">
      <div className="stat">
        <span>Total pesanan</span>
        <strong>{r.totalPesanan}</strong>
        <small>{aktif} masih dikerjakan</small>
      </div>
      <div className="stat">
        <span>Pendapatan tercatat</span>
        <strong>{formatRupiah(r.totalPendapatan)}</strong>
        <small>dari seluruh pesanan</small>
      </div>
      <div className="stat">
        <span>Pelanggan</span>
        <strong>{r.totalPelanggan}</strong>
        <small>terdaftar</small>
      </div>
      <div className="stat">
        <span>Jenis layanan</span>
        <strong>{r.totalLayanan}</strong>
        <small>tersedia</small>
      </div>
    </div>
  )
}

