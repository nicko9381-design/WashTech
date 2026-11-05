import { Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Pesanan, StatusPesanan } from '../../pesanan/types'
import { statusColorMap } from '../../pesanan/types'
import { formatRupiah, formatTanggal } from '../../../shared/utils/format'

interface RecentOrdersTableProps {
  terbaru: Pesanan[]
}

const columns: ColumnsType<Pesanan> = [
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
    render: (nama: string) => (
      <strong style={{ fontWeight: 700, color: 'var(--ink)' }}>{nama}</strong>
    ),
  },
  {
    title: 'Layanan',
    dataIndex: 'layananNama',
    key: 'layananNama',
    render: (layanan: string) => (
      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{layanan}</span>
    ),
  },
  {
    title: 'Total',
    dataIndex: 'totalHarga',
    key: 'totalHarga',
    align: 'right',
    render: (total: number) => (
      <strong style={{ fontWeight: 700, color: 'var(--ink)' }}>{formatRupiah(total)}</strong>
    ),
  },
  {
    title: 'Estimasi',
    dataIndex: 'estimasiSelesai',
    key: 'estimasiSelesai',
    render: (estimasi: string) => (
      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{formatTanggal(estimasi)}</span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: StatusPesanan) => (
      <Tag color={statusColorMap[status]} style={{ fontWeight: 700, padding: '2px 10px', borderRadius: 999 }}>
        {status.toUpperCase()}
      </Tag>
    ),
  },
]

export default function RecentOrdersTable({ terbaru }: RecentOrdersTableProps) {
  return (
    <Table<Pesanan>
      columns={columns}
      dataSource={terbaru}
      rowKey="id"
      pagination={false}
      scroll={{ x: 'max-content' }}
      locale={{ emptyText: 'Belum ada pesanan terbaru.' }}
    />
  )
}

