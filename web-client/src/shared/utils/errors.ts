import { ApiError } from '../api/client'
import type { FieldError } from '../types'

export const errorMessage = (err: unknown): string => {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error) return err.message
  return 'Terjadi kesalahan. Silakan coba lagi.'
}

export const fieldErrorsFrom = (err: unknown): Record<string, string> => {
  if (!(err instanceof ApiError) || !err.errors?.length) return {}
  const map: Record<string, string> = {}
  err.errors.forEach((e: FieldError) => {
    map[e.field] = e.message
  })
  return map
}

