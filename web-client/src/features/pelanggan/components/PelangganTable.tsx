import { useMemo } from 'react'
import { Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Pelanggan } from '../types'
import { formatTanggal } from '../../../shared/utils/format'

interface PelangganTableProps {
  data: Pelanggan[]
  loading?: boolean
}

export default function PelangganTable({ data, loading }: PelangganTableProps) {
  const columns: ColumnsType<Pelanggan> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 70,
        render: (id: number) => <span className="code">{id}</span>,
      },
      {
        title: 'Nama',
        dataIndex: 'nama',
        key: 'nama',
        render: (nama: string) => (
          <strong style={{ fontWeight: 700, color: 'var(--ink)' }}>{nama}</strong>
        ),
      },
      {
        title: 'Telepon',
        dataIndex: 'telepon',
        key: 'telepon',
        render: (telepon: string) => (
          <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{telepon}</span>
        ),
      },
      {
        title: 'Alamat',
        dataIndex: 'alamat',
        key: 'alamat',
        render: (alamat: string | null) => (
          <span style={{ fontWeight: 500, color: alamat ? 'var(--ink)' : 'var(--muted)' }}>
            {alamat || '—'}
          </span>
        ),
      },
      {
        title: 'Transaksi',
        dataIndex: 'totalPesanan',
        key: 'totalPesanan',
        align: 'center',
        render: (total?: number) => (
          <Tag color={(total ?? 0) > 0 ? 'blue' : 'default'} style={{ borderRadius: 999, fontWeight: 600 }}>
            {total ?? 0} pesanan
          </Tag>
        ),
      },
      {
        title: 'Terdaftar',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (tgl: string) => (
          <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{formatTanggal(tgl)}</span>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'aktif',
        key: 'aktif',
        width: 120,
        align: 'center',
        render: (aktif: number | boolean) => {
          const isAktif = Boolean(aktif)
          return (
            <Tag
              color={isAktif ? 'success' : 'default'}
              style={{ borderRadius: 999, fontWeight: 700, margin: 0 }}
            >
              {isAktif ? 'AKTIF' : 'NONAKTIF'}
            </Tag>
          )
        },
      },
    ],
    []
  )

  return (
    <Table<Pelanggan>
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 'max-content' }}
      pagination={{
        pageSize: 8,
        showTotal: (total) => `Total ${total} pelanggan`,
        showSizeChanger: false,
      }}
      locale={{ emptyText: 'Tidak ada data pelanggan.' }}
    />
  )
}
