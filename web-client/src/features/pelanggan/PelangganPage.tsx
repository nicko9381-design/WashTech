import { useMemo, useState } from 'react'
import {
  Input,
  Segmented,
  Flex,
  Spin,
} from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { pelangganApi } from './api/pelangganApi'
import { useAsync } from '../../shared/hooks/useAsync'
import PelangganTable from './components/PelangganTable'
import ErrorAlert from '../../shared/components/ErrorAlert'

type FilterStatus = 'semua' | 'aktif' | 'nonaktif'

export default function PelangganPage() {
  const { data, loading, error, reload } = useAsync(pelangganApi.list)
  const items = data ?? []

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('semua')

  const counts = useMemo(() => {
    const total = items.length
    const aktif = items.filter((p) => Boolean(p.aktif)).length
    const nonaktif = total - aktif
    return { semua: total, aktif, nonaktif }
  }, [items])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((p) => {
      const matchFilter =
        filter === 'semua' ||
        (filter === 'aktif' && Boolean(p.aktif)) ||
        (filter === 'nonaktif' && !p.aktif)

      const matchSearch =
        !q ||
        p.nama.toLowerCase().includes(q) ||
        p.telepon.includes(q) ||
        String(p.id).includes(q)

      return matchFilter && matchSearch
    })
  }, [items, search, filter])

  const segmentedOptions = [
    { label: `Semua (${counts.semua})`, value: 'semua' },
    { label: `Aktif (${counts.aktif})`, value: 'aktif' },
    { label: `Nonaktif (${counts.nonaktif})`, value: 'nonaktif' },
  ]

  if (loading && items.length === 0) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Spin size="large" tip="Memuat pelanggan..." />
      </Flex>
    )
  }

  if (error && items.length === 0) {
    return (
      <ErrorAlert
        message="Gagal memuat data pelanggan"
        description={error ?? 'Terjadi kesalahan saat memuat data.'}
        onRetry={() => void reload()}
      />
    )
  }

  return (
    <Flex vertical gap={24}>
      <Flex justify="space-between" align="flex-end" wrap="wrap" gap={12}>
        <div>
          <h1 className="page-title">Pelanggan</h1>
          <p className="page-subtitle">Daftar pelanggan laundry beserta status dan riwayat pesanannya.</p>
        </div>
        <button type="button" className="btn" onClick={() => void reload()}>
          <ReloadOutlined /> Segarkan
        </button>
      </Flex>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Cari ID, nama, atau telepon…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{
              maxWidth: 300,
              borderRadius: 10,
              padding: '8px 12px',
              borderColor: 'var(--line)',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          />
          <div className="segmented-scroll">
            <Segmented
              options={segmentedOptions}
              value={filter}
              onChange={(val) => setFilter(val as FilterStatus)}
            />
          </div>
        </Flex>

        <PelangganTable
          data={visible}
          loading={loading}
        />
      </div>
    </Flex>
  )
}
