import { Link } from 'react-router-dom'
import {
  Spin,
  Flex,
} from 'antd'
import {
  ReloadOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { dashboardApi } from './api/dashboardApi'
import { useAsync } from '../../shared/hooks/useAsync'
import DashboardStats from './components/DashboardStats'
import DashboardPipeline from './components/DashboardPipeline'
import RecentOrdersTable from './components/RecentOrdersTable'
import ErrorAlert from '../../shared/components/ErrorAlert'

export default function DashboardPage() {
  const { data, loading, error, reload } = useAsync(dashboardApi.fetchDashboard)

  if (loading && !data) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Spin size="large" tip="Memuat dashboard..." />
      </Flex>
    )
  }

  if (error || !data) {
    return (
      <ErrorAlert
        message="Gagal memuat data dashboard"
        description={error ?? 'Terjadi kesalahan saat memuat data.'}
        onRetry={() => void reload()}
      />
    )
  }

  const { ringkasan: r, terbaru } = data
  const aktif = r.pesananPerStatus.diterima + r.pesananPerStatus.diproses

  return (
    <Flex vertical gap={24}>
      {/* Page Header */}
      <Flex justify="space-between" align="flex-end" wrap="wrap" gap={12}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Ringkasan operasional laundry hari ini.</p>
        </div>
        <button type="button" className="btn" onClick={() => void reload()}>
          <ReloadOutlined /> Segarkan
        </button>
      </Flex>

      {/* Kartu Statistik */}
      <DashboardStats ringkasan={r} aktif={aktif} />

      {/* Alur Pesanan */}
      <DashboardPipeline ringkasan={r} />

      {/* Pesanan Terbaru */}
      <div style={{ marginBottom: 16 }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 14 }}>
          <h2 className="section-title">Pesanan terbaru</h2>
          <Link
            to="/pesanan"
            style={{ color: '#0e7490', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            Lihat semua <ArrowRightOutlined />
          </Link>
        </Flex>
        <RecentOrdersTable terbaru={terbaru} />
      </div>
    </Flex>
  )
}
