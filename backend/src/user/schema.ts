import { Asserts, object, string } from "yup";

export const createUserSchema = object({
  email: string().email().required(),
  password: string().required(),
  passwordConfirmation: string()
    .required()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
  username: string().required(),
});

export type createUserInput = Asserts<typeof createUserSchema>
