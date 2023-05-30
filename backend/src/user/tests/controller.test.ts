import { UserController } from "../controller";
import { UserService } from "../service";
import { ExpressReqMock } from "../../test-utils/mocks";
import { generateCreatePayload, generateSignInPayload } from "../../test-utils/payload";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mockedUserService: jest.Mocked<UserService> = {
  getUserById: jest.fn(),
  createUser: jest.fn(),
  signIn: jest.fn(),
}

describe("UserController", () => {
  const userController: UserController = new UserController(mockedUserService);

  afterEach(() => {
    mockedUserService.getUserById.mockClear();
    mockedUserService.createUser.mockClear();
    mockedUserService.signIn.mockClear();
  });

  describe("Create User", () => {
    it("Should return \"ok\" if all goes well", async () => {
      const payload = generateCreatePayload();
      const result = await userController.createUser(ExpressReqMock, payload);
      expect(result).toEqual({
        ok: true,
        err: null,
        data: "ok",
      });
      expect(mockedUserService.createUser).toHaveBeenCalledWith(payload);
    });

    describe("Should return a ValidationError if required fields are not supplied", () => {
      it("No username", async () => {
        const payload = generateCreatePayload();
        payload.username = "";
        const result = await userController.createUser(ExpressReqMock, payload);
        expect(result.err?.name).toEqual("ValidationError");
        expect(mockedUserService.createUser).not.toHaveBeenCalled();
      });

      it("No email", async () => {
        const payload = generateCreatePayload();
        payload.email = "";
        const result = await userController.createUser(ExpressReqMock, payload);
        expect(result.err?.name).toEqual("ValidationError");
        expect(mockedUserService.createUser).not.toHaveBeenCalled();
      });

      it("No password", async () => {
        const payload = generateCreatePayload();
        payload.password = "";
        const result = await userController.createUser(ExpressReqMock, payload);
        expect(result.err?.name).toEqual("ValidationError");
        expect(mockedUserService.createUser).not.toHaveBeenCalled();
      });

      it("No passwordConfirmation", async () => {
        const payload = generateCreatePayload();
        payload.passwordConfirmation = "";
        const result = await userController.createUser(ExpressReqMock, payload);
        expect(result.err?.name).toEqual("ValidationError");
        expect(mockedUserService.createUser).not.toHaveBeenCalled();
      });
    });

    it("Should return a ValidationError if the email is not valid", async () => {
      const payload = generateCreatePayload();
      payload.email = "not-an-email.com";
      const result = await userController.createUser(ExpressReqMock, payload);
      expect(result.err?.name).toEqual("ValidationError");
      expect(mockedUserService.createUser).not.toHaveBeenCalled();
    });

    it("Should return a ValidationError if the passwords don't match", async () => {
      const payload = generateCreatePayload();
      payload.password = "testPassword";
      payload.passwordConfirmation = "notTheSamePassword";
      const result = await userController.createUser(ExpressReqMock, payload);
      expect(result.err?.name).toEqual("ValidationError");
      expect(mockedUserService.createUser).not.toHaveBeenCalled();
    });
  });

  describe("Sign In", () => {
    it("Should return \"ok\" if all goes well", async () => {
      const payload = generateSignInPayload();
      const result = await userController.signIn(ExpressReqMock, payload);
      expect(result).toEqual({
        ok: true,
        err: null,
        data: "ok",
      });
      expect(mockedUserService.signIn).toHaveBeenCalledWith(payload);
    });

    describe("Should return a ValidationError if required fields are not supplied", () => {
      it("No email", async () => {
        const payload = generateSignInPayload();
        payload.email = "";
        const result = await userController.signIn(ExpressReqMock, payload);
        expect(result.err?.name).toEqual("ValidationError");
        expect(mockedUserService.createUser).not.toHaveBeenCalled();
      });
    });
  });
});
