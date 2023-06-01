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

export type User = {
  email: string,
  username: string,
}

export type TodoList = {
  id: number,
  publicId: string,
  name: string,
}

export type TodoItem = {
  id: number,
  text: string,
  completed: boolean,
}
