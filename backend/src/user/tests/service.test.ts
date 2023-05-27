import { UserService } from "../service";
import { ValidationError } from "yup";
import { db } from "../../data-source";

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
