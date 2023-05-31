import { UserService } from "../service";
import { ValidationError } from "yup";
import { db } from "../../data-source";
import { UserFactory } from "../../test-utils/factories";
import { hashSync } from "bcrypt";
import { AuthenticationError } from "../../error";

describe("UserService", () => {
  let userService: UserService;

  beforeAll(async () => {
    userService = new UserService();
    await db.initialize();
  });

  afterEach(async () => {
    await db.synchronize(true);
  });

  afterAll(async () => {
    await db.close();
  });

  describe("createUser", () => {

    it("Should create user", async () => {
      const newUser = await userService.createUser({
        username: "test",
        email: "test@example.com",
        password: "test",
        passwordConfirmation: "test",
      });

      const user = await db.createQueryBuilder()
        .select("user")
        .from("user", "user")
        .where("id = :id", { id: newUser.id })
        .getOne();
      expect(user).toBeDefined();
      expect(user?.id).toBeDefined();
      expect(user?.username).toEqual("test");
      expect(user?.email).toEqual("test@example.com");
      expect(user?.password).toBeDefined();
    });

    it("Throws validation error on duplicate email", async () => {
      await userService.createUser({
        username: "test",
        email: "test@example.com",
        password: "test",
        passwordConfirmation: "test",
      });

      await expect(
        userService.createUser({
          username: "test2",
          email: "test@example.com",
          password: "test",
          passwordConfirmation: "test",
        })
      ).rejects.toThrowError(ValidationError);
    });

    it("Throws validation error on duplicate username", async () => {
      await userService.createUser({
        username: "test",
        email: "test@example.com",
        password: "test",
        passwordConfirmation: "test",
      });

      await expect(
        userService.createUser({
          username: "test2",
          email: "test@example.com",
          password: "test",
          passwordConfirmation: "test",
        })
      ).rejects.toThrowError(ValidationError);
    });
  });

  describe("authUser", () => {
    it("Should return user on success", async () => {
      const password = hashSync("test", 10);
      const user = await new UserFactory().create({ password });
      const returnedUser = await userService.authUser(user);
      expect(returnedUser).toBeDefined();
    });

    // This could happen if the user is deleted but has a signed-in session somewhere
    it("Should throw AuthenticationError if user not found", async () => {
      const user = await new UserFactory().create();
      await db.createQueryBuilder()
        .from("user", "user")
        .where("id = :id", { id: user.id })
        .delete()
        .execute();

      await expect(() => userService.authUser(user)).rejects.toThrow(
        AuthenticationError
      );
    });

    it("Should throw AuthenticationError if user not supplied", async () => {
      await expect(() => userService.authUser(undefined)).rejects.toThrow(
        AuthenticationError
      );
    });
  });

  describe("signIn", () => {
    it("Should return user on success", async () => {
      const password = hashSync("test", 10);
      const user = await new UserFactory().create({ password });
      const returnedUser = await userService.signIn({
        email: user.email,
        password: "test"
      });
      expect(returnedUser).toBeDefined();
      expect(returnedUser?.id).toEqual(user.id);
      expect(returnedUser?.username).toEqual(user.username);
    });

    it("Should throw ValidationError on incorrect email", async () => {
      const password = hashSync("test", 10);
      await new UserFactory().create({ password });
      await expect(
        userService.signIn({ email: "not.user@email.com", password: "test" })
      ).rejects.toThrowError(ValidationError);
    });

    it("Should throw ValidationError on incorrect password", async () => {
      const user = await new UserFactory().create();

      await expect(
        userService.signIn({ email: user.email, password: "incorrect_password" })
      ).rejects.toThrowError(ValidationError);
    });
  });

});
