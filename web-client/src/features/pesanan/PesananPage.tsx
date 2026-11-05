import { useMemo, useState } from 'react'
import {
  Input,
  Segmented,
  Flex,
  Spin,
} from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { pesananApi } from './api/pesananApi'
import { useAsync } from '../../shared/hooks/useAsync'
import type { StatusPesanan } from './types'
import { STATUS_LIST } from './types'
import PesananTable from './components/PesananTable'
import ErrorAlert from '../../shared/components/ErrorAlert'

export default function PesananPage() {
  const { data, loading, error, reload } = useAsync(pesananApi.list)
  const pesanan = data ?? []

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<StatusPesanan | 'semua'>('semua')

  const counts = useMemo(() => {
    const c: Record<string, number> = { semua: pesanan.length }
    STATUS_LIST.forEach((s) => (c[s.value] = pesanan.filter((p) => p.status === s.value).length))
    return c
  }, [pesanan])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return pesanan.filter(
      (p) =>
        (filter === 'semua' || p.status === filter) &&
        (!q || p.pelangganNama.toLowerCase().includes(q) || String(p.id).includes(q)),
    )
  }, [pesanan, search, filter])

  const segmentedOptions = [
    { label: `Semua (${counts.semua ?? 0})`, value: 'semua' },
    ...STATUS_LIST.map((s) => ({
      label: `${s.label} (${counts[s.value] ?? 0})`,
      value: s.value,
    })),
  ]

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Spin size="large" tip="Memuat pesanan..." />
      </Flex>
    )
  }

  if (error) {
    return (
      <ErrorAlert
        message="Gagal memuat data pesanan"
        description={error ?? 'Terjadi kesalahan saat memuat data.'}
        onRetry={() => void reload()}
      />
    )
  }

  return (
    <Flex vertical gap={24}>
      <Flex justify="space-between" align="flex-end" wrap="wrap" gap={12}>
        <div>
          <h1 className="page-title">Pesanan</h1>
          <p className="page-subtitle">Daftar pesanan dan pantau status cucian.</p>
        </div>
        <button type="button" className="btn" onClick={() => void reload()}>
          <ReloadOutlined /> Segarkan
        </button>
      </Flex>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Cari ID atau nama pelanggan…"
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
              onChange={(val) => setFilter(val as StatusPesanan | 'semua')}
            />
          </div>
        </Flex>

        <PesananTable
          data={visible}
          loading={loading}
        />
      </div>
    </Flex>
  )
}

