export interface RestError {
  name: string
  message: string
  extra?: Record<string, unknown>
}

export interface RestValidationError {
  name: 'ValidationError'
  message: string
  extra: {
    field: string
    message: string
  }
}

export type RestResponse<T> = {
  ok: boolean
  err?: RestError | RestValidationError
  data: T
}