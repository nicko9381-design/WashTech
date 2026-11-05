import { useMemo } from 'react'
import { Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Pesanan, StatusPesanan } from '../types'
import { statusColorMap } from '../types'
import { formatBerat, formatRupiah, formatTanggal } from '../../../shared/utils/format'

interface PesananTableProps {
  data: Pesanan[]
  loading?: boolean
}

export default function PesananTable({
  data,
  loading,
}: PesananTableProps) {
  const columns: ColumnsType<Pesanan> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (id: number) => (
          <span className="code">{id}</span>
        ),
      },
      {
        title: 'Pelanggan',
        dataIndex: 'pelangganNama',
        key: 'pelangganNama',
        render: (_: unknown, p: Pesanan) => (
          <div>
            <strong style={{ fontWeight: 700, color: 'var(--ink)' }}>{p.pelangganNama}</strong>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 500 }}>{p.pelangganTelepon}</div>
          </div>
        ),
      },
      {
        title: 'Layanan',
        dataIndex: 'layananNama',
        key: 'layananNama',
        render: (_: unknown, p: Pesanan) => (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.layananNama}</div>
            {p.catatan && (
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 500 }}>
                📝 {p.catatan}
              </div>
            )}
          </div>
        ),
      },
      {
        title: 'Berat',
        dataIndex: 'beratKg',
        key: 'beratKg',
        align: 'right',
        render: (berat: number) => (
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{formatBerat(berat)}</span>
        ),
      },
      {
        title: 'Total',
        dataIndex: 'totalHarga',
        key: 'totalHarga',
        align: 'right',
        sorter: (a, b) => a.totalHarga - b.totalHarga,
        render: (total: number) => (
          <strong style={{ fontWeight: 700, color: 'var(--ink)' }}>{formatRupiah(total)}</strong>
        ),
      },
      {
        title: 'Estimasi Selesai',
        dataIndex: 'estimasiSelesai',
        key: 'estimasiSelesai',
        render: (tgl: string) => (
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{formatTanggal(tgl)}</span>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (status: StatusPesanan) => (
          <Tag color={statusColorMap[status]} style={{ fontWeight: 700, padding: '2px 10px', borderRadius: 999 }}>
            {status.toUpperCase()}
          </Tag>
        ),
      },
    ],
    []
  )

  return (
    <Table<Pesanan>
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 'max-content' }}
      pagination={{
        pageSize: 8,
        showTotal: (total) => `Total ${total} pesanan`,
        showSizeChanger: false,
      }}
      locale={{ emptyText: 'Tidak ada data pesanan.' }}
    />
  )
}

