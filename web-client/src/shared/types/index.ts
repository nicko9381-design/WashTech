export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface FieldError {
  field: string
  message: string
}

