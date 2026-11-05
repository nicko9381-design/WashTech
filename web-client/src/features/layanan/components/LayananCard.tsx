import { Popconfirm } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons'
import type { Layanan } from '../types'
import { formatRupiah } from '../../../shared/utils/format'

interface LayananCardProps {
  layanan: Layanan
  onEdit: (item: Layanan) => void
  onDelete: (item: Layanan) => void
  onToggleStatus: (item: Layanan) => void
  isDeleting?: boolean
}

export default function LayananCard({
  layanan: l,
  onEdit,
  onDelete,
  onToggleStatus,
  isDeleting,
}: LayananCardProps) {
  const isAktif = Boolean(l.aktif)
  const isUsed = (l.totalPesanan ?? 0) > 0

  return (
    <article className={`service-card${!isAktif ? ' inactive' : ''}`}>
      <div>
        <div className="service-header">
          <div>
            <h3>{l.nama}</h3>
            <div className="service-badges" style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className={`badge-status ${isAktif ? 'aktif' : 'nonaktif'}`}>
                {isAktif ? 'Aktif' : 'Nonaktif'}
              </span>
              <span className="service-badge">
                <ClockCircleOutlined />
                {l.estimasiHari === 0 ? 'Selesai hari ini' : `${l.estimasiHari} hari`}
              </span>
            </div>
          </div>
        </div>

        <p className="service-desc">{l.deskripsi || 'Khusus pakaian yang sudah bersih'}</p>
      </div>

      <div>
        <div className="service-price-block">
          <span className="service-price-label">Tarif:</span>
          <div className="service-price">
            {formatRupiah(l.hargaPerKg)}
            <span> / kg</span>
          </div>
        </div>

        {isUsed && (
          <div className="service-usage-note">
            <span>Digunakan pada {l.totalPesanan} transaksi</span>
          </div>
        )}

        <div className="service-actions">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => onEdit(l)}
          >
            <EditOutlined /> Ubah
          </button>

          {isUsed ? (
            <button
              type="button"
              className={`btn btn-sm ${isAktif ? 'btn-outline-warning' : 'btn-outline-success'}`}
              onClick={() => onToggleStatus(l)}
            >
              {isAktif ? (
                <>
                  <StopOutlined /> Nonaktifkan
                </>
              ) : (
                <>
                  <CheckCircleOutlined /> Aktifkan
                </>
              )}
            </button>
          ) : (
            <Popconfirm
              title="Hapus Layanan"
              description={`Apakah Anda yakin ingin menghapus layanan "${l.nama}"?`}
              okText="Ya, Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(l)}
            >
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                disabled={isDeleting}
              >
                <DeleteOutlined /> Hapus
              </button>
            </Popconfirm>
          )}
        </div>
      </div>
    </article>
  )
}

