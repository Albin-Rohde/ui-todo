import { Asserts, boolean, number, object, string } from "yup";

export const createTodoItemSchema = object().shape({
  text: string().optional().default(""),
  completed: boolean().optional().default(false),
  parentId: number().optional().nullable().default(null),
});
export type createTodoItemInput = Asserts<typeof createTodoItemSchema>