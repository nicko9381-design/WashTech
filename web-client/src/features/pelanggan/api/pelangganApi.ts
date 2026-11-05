import { http } from '../../../shared/api/client'
import type { Pelanggan } from '../types'

export const pelangganApi = {
  list: async () => (await http.get<Pelanggan[]>('/pelanggan')).data,
  getById: async (id: number) => (await http.get<Pelanggan>(`/pelanggan/${id}`)).data,
}
