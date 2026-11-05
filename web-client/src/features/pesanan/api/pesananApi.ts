import { http } from '../../../shared/api/client'
import type { Pesanan } from '../types'

export const pesananApi = {
  list: async () => (await http.get<Pesanan[]>('/pesanan')).data,
  remove: async (id: number) => (await http.delete<{ id: number }>(`/pesanan/${id}`)).data,
}
