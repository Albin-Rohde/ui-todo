import { Asserts, object, string } from "yup";

export const updateTodoListSchema = object().shape({
  name: string().required(),
});
export type createUserInput = Asserts<typeof updateTodoListSchema>

