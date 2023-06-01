import { Asserts, boolean, object, string } from "yup";

export const createTodoItemSchema = object().shape({
  text: string().optional().default(""),
  completed: boolean().optional().default(false),
});
export type createTodoItemInput = Asserts<typeof createTodoItemSchema>