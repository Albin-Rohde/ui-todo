import { UserController } from "../controller";
import { UserService } from "../service";
import { UserDAO } from "../dao";


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mockedUserService: jest.Mocked<UserService> = {
  userDAO: jest.mocked(UserDAO) as unknown as UserDAO,
  getUserById: jest.fn(),
  createUser: jest.fn(),
  hashPassword: jest.fn(),
}

describe("UserController", () => {
  const userController: UserController = new UserController(mockedUserService);

  describe("Create User", () => {
    it("Should return \"ok\" if all goes well", async () => {
      const result = await userController.createUser({
        username: "test",
        email: "test@example.com",
        password: "testPassword",
        passwordConfirmation: "testPassword",
      });
      expect(result).toEqual({
        ok: true,
        err: null,
        data: "ok",
      });
    });

    it("Should return a ValidationError if required fields are not supplied", async () => {
      const result = await userController.createUser({
        username: "",
        email: "test@example.com",
        password: "testPassword",
        passwordConfirmation: "testPassword2",
      });
      expect(result.err?.name).toEqual("ValidationError");

      const result2 = await userController.createUser({
        username: "test",
        email: "",
        password: "testPassword",
        passwordConfirmation: "testPassword2",
      });
      expect(result2.err?.name).toEqual("ValidationError");

      const result3 = await userController.createUser({
        username: "test",
        email: "test@example.com",
        password: "",
        passwordConfirmation: "testPassword2",
      });
      expect(result3.err?.name).toEqual("ValidationError");
    });

    it("Should return a ValidationError if the email is not valid", async () => {
      const result = await userController.createUser({
        username: "test",
        email: "test.not-an-email.com",
        password: "testPassword",
        passwordConfirmation: "testPassword2",
      });
      expect(result.err?.name).toEqual("ValidationError");
    });

    it("Should return a ValidationError if the passwords don't match", async () => {
      const result = await userController.createUser({
        username: "test",
        email: "test@example.com",
        password: "testPassword",
        passwordConfirmation: "testPassword2",
      });
      expect(result.err?.name).toEqual("ValidationError");
    });
  });
});
