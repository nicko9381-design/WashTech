import { useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
} from 'antd'
import type { Layanan, LayananInput } from '../types'

interface LayananModalProps {
  open: boolean
  editingItem: Layanan | null
  submitting: boolean
  onClose: () => void
  onSubmit: (values: LayananInput) => Promise<void>
}

export default function LayananModal({
  open,
  editingItem,
  submitting,
  onClose,
  onSubmit,
}: LayananModalProps) {
  const [form] = Form.useForm<LayananInput>()

  useEffect(() => {
    if (open) {
      if (editingItem) {
        form.setFieldsValue({
          nama: editingItem.nama,
          deskripsi: editingItem.deskripsi ?? '',
          hargaPerKg: editingItem.hargaPerKg,
          estimasiHari: editingItem.estimasiHari,
          aktif: editingItem.aktif ? 1 : 0,
        })
      } else {
        form.resetFields()
        form.setFieldsValue({ estimasiHari: 2, aktif: 1 })
      }
    }
  }, [open, editingItem, form])

  return (
    <Modal
      title={editingItem ? 'Ubah Layanan' : 'Tambah Layanan Baru'}
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={submitting}
      okText={editingItem ? 'Simpan Perubahan' : 'Tambah Layanan'}
      cancelText="Batal"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="nama"
          label="Nama Layanan"
          rules={[
            { required: true, message: 'Nama layanan wajib diisi' },
            { min: 2, message: 'Nama layanan minimal 2 karakter' },
          ]}
        >
          <Input placeholder="Contoh: Cuci Kering Reguler" />
        </Form.Item>

        <Form.Item name="deskripsi" label="Deskripsi">
          <Input.TextArea
            rows={2}
            placeholder="Deskripsi singkat layanan (opsional)"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="hargaPerKg"
              label="Tarif per kg (Rp)"
              rules={[
                { required: true, message: 'Tarif wajib diisi' },
                { type: 'number', min: 0, message: 'Tarif harus >= 0' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={500}
                placeholder="Contoh: 8000"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="estimasiHari"
              label="Estimasi Pengerjaan (Hari)"
              rules={[
                { required: true, message: 'Estimasi hari wajib diisi' },
                { type: 'number', min: 0, max: 30, message: '0 - 30 hari' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={30}
                placeholder="Contoh: 2"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="aktif"
          label="Status Layanan"
          tooltip="Layanan nonaktif tidak menerima cucian baru"
        >
          <Select
            options={[
              { label: '🟢 Aktif (Tersedia)', value: 1 },
              { label: '⚪ Nonaktif (Tidak Tersedia)', value: 0 },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

