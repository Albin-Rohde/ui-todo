import { boolean, object, string } from "yup";

export const updateTodoListSchema = object().shape({
  name: string().required(),
  private: boolean().optional().default(false),
  readonly: boolean().optional().default(false),
});

