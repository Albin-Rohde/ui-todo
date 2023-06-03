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
  id: number,
  email: string,
  username: string,
}

export type TodoList = {
  id: number,
  publicId: string,
  name: string,
  readonly: boolean,
  private: boolean,
  createdAt: string,
}

export type TodoItem = {
  id: number,
  text: string,
  completed: boolean,
}

export type CursorPosition = {
  userId: number,
  username: string,
  itemId: number,
  listId: string,
  cursorStart: number, // String index of todoItem input field
  cursorEnd: number, // String index of todoItem input field
}
