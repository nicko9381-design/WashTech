import { http } from '../../../shared/api/client'
import type { Layanan, LayananInput } from '../types'

export const layananApi = {
  list: async () => (await http.get<Layanan[]>('/layanan')).data,
  create: async (input: LayananInput) => (await http.post<Layanan>('/layanan', input)).data,
  update: async (id: number, input: Partial<LayananInput>) =>
    (await http.put<Layanan>(`/layanan/${id}`, input)).data,
  remove: async (id: number) => (await http.delete<{ id: number }>(`/layanan/${id}`)).data,
}
