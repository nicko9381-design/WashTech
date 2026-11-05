import { useState } from 'react'
import {
  Row,
  Col,
  Flex,
  Spin,
  App,
} from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { layananApi } from './api/layananApi'
import { useAsync } from '../../shared/hooks/useAsync'
import type { Layanan, LayananInput } from './types'
import { errorMessage } from '../../shared/utils/errors'
import LayananCard from './components/LayananCard'
import LayananModal from './components/LayananModal'
import ErrorAlert from '../../shared/components/ErrorAlert'

export default function LayananPage() {
  const { message } = App.useApp()
  const { data, setData, loading, error, reload } = useAsync(layananApi.list)
  const items = data ?? []

  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Layanan | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleOpenCreate = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (item: Layanan) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleFormSubmit = async (values: LayananInput) => {
    setSubmitting(true)
    try {
      if (editingItem) {
        const updated = await layananApi.update(editingItem.id, values)
        setData((prev) => (prev ?? []).map((l) => (l.id === editingItem.id ? updated : l)))
        message.success(`Layanan "${updated.nama}" berhasil diperbarui`)
      } else {
        const created = await layananApi.create(values)
        setData((prev) => [...(prev ?? []), created])
        message.success(`Layanan "${created.nama}" berhasil ditambahkan`)
      }
      setModalOpen(false)
    } catch (err) {
      message.error(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (item: Layanan) => {
    setDeletingId(item.id)
    try {
      await layananApi.remove(item.id)
      setData((prev) => (prev ?? []).filter((l) => l.id !== item.id))
      message.success(`Layanan "${item.nama}" berhasil dihapus`)
    } catch (err) {
      message.error(errorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleStatus = async (item: Layanan) => {
    const nextStatus = item.aktif ? 0 : 1
    try {
      const updated = await layananApi.update(item.id, { aktif: nextStatus })
      setData((prev) => (prev ?? []).map((l) => (l.id === item.id ? updated : l)))
      message.success(`Layanan "${item.nama}" berhasil ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
    } catch (err) {
      message.error(errorMessage(err))
    }
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Spin size="large" tip="Memuat layanan..." />
      </Flex>
    )
  }

  if (error) {
    return (
      <ErrorAlert
        message="Gagal memuat data layanan"
        description={error ?? 'Terjadi kesalahan saat memuat data.'}
        onRetry={() => void reload()}
      />
    )
  }

  const renderContent = () => {
    if (items.length === 0) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', background: '#fff', borderRadius: 14 }}>
          <p style={{ color: 'var(--muted)', fontWeight: 600 }}>Belum ada layanan yang ditambahkan.</p>
          <div style={{ marginTop: 14 }}>
            <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
              <PlusOutlined /> Tambah Layanan Pertama
            </button>
          </div>
        </div>
      )
    }

    return (
      <Row gutter={[{ xs: 12, sm: 16 }, { xs: 12, sm: 16 }]}>
        {items.map((l) => (
          <Col xs={24} sm={12} lg={8} key={l.id}>
            <LayananCard
              layanan={l}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              isDeleting={deletingId === l.id}
            />
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <Flex vertical gap={24}>
      <div className="page-head-wrap">
        <div>
          <h1 className="page-title">Layanan</h1>
          <p className="page-subtitle">Jenis layanan, harga per kilogram, dan lama pengerjaan.</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn" onClick={() => void reload()}>
            <ReloadOutlined /> Segarkan
          </button>
          <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
            <PlusOutlined /> Tambah Layanan
          </button>
        </div>
      </div>

      {renderContent()}

      {/* Modal Form Tambah / Ubah */}
      <LayananModal
        open={modalOpen}
        editingItem={editingItem}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </Flex>
  )
}

