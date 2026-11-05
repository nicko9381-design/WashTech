import type { ApiResponse, FieldError } from '../types'

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api'
export const API_URL: string = rawApiUrl.replace(/\/+$/, '')

export class ApiError extends Error {
  status: number
  errors: FieldError[]

  constructor(message: string, status: number, errors: FieldError[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  let response: Response
  const endpoint = path.startsWith('/') ? path : `/${path}`
  const targetUrl = `${API_URL}${endpoint}`

  try {
    response = await fetch(targetUrl, options)
  } catch {
    throw new ApiError(`Tidak dapat terhubung ke server API (${API_URL}). Pastikan server sudah dijalankan.`, 0)
  }

  let body: unknown = null
  try {
    body = await response.json()
  } catch {
    // respons bukan JSON
  }

  if (!response.ok) {
    const err = (body ?? {}) as { message?: string; error?: string; errors?: FieldError[] }
    const message = err.message ?? (typeof err.error === 'string' ? err.error : `Permintaan gagal (HTTP ${response.status})`)
    throw new ApiError(message, response.status, err.errors ?? [])
  }
  return body as ApiResponse<T>
}

const jsonBody = (method: string, payload: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, payload: unknown) => request<T>(path, jsonBody('POST', payload)),
  put: <T>(path: string, payload: unknown) => request<T>(path, jsonBody('PUT', payload)),
  patch: <T>(path: string, payload: unknown) => request<T>(path, jsonBody('PATCH', payload)),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

