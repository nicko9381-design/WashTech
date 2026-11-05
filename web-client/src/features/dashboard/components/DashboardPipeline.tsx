import { Flex } from 'antd'
import type { Ringkasan } from '../types'
import { STATUS_LIST } from '../../pesanan/types'

interface DashboardPipelineProps {
  ringkasan: Ringkasan
}

export default function DashboardPipeline({ ringkasan: r }: DashboardPipelineProps) {
  return (
    <Flex vertical gap={12}>
      <h2 className="section-title">Alur pesanan</h2>
      <div className="pipeline">
        {STATUS_LIST.map((s) => (
          <div key={s.value} className={`pipe status-${s.value}`}>
            <strong>{r.pesananPerStatus[s.value]}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </Flex>
  )
}

