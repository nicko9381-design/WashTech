import { http } from '../../../shared/api/client'
import { pesananApi } from '../../pesanan/api/pesananApi'
import type { Ringkasan } from '../types'
import type { Pesanan } from '../../pesanan/types'

export const dashboardApi = {
  getRingkasan: async () => (await http.get<Ringkasan>('/ringkasan')).data,
  fetchDashboard: async (): Promise<{ ringkasan: Ringkasan; terbaru: Pesanan[] }> => {
    const [ringkasan, semua] = await Promise.all([
      dashboardApi.getRingkasan(),
      pesananApi.list(),
    ])
    return { ringkasan, terbaru: semua.slice(0, 5) }
  },
}

