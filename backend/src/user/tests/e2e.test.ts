import request from "supertest";
import "reflect-metadata";
import { db } from "../../data-source";
import { Server } from "http";
import { getTestServer } from "../../test-utils/testServer";
import { UserFactory } from "../../test-utils/factories";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

const generateCreatePayload = () => {
  const password = faker.internet.password();
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: password,
    passwordConfirmation: password,
  }
};

describe("User rest routes", () => {
  let server: Server;

  beforeAll(async () => {
    server = await getTestServer()
  });

  afterEach(async () => {
    await db.synchronize(true)
  });

  afterAll(async () => {
    await db.close();
    server.close();
  });

  describe("POST /api/user", () => {
    it("Should create user", async () => {
      const payload = generateCreatePayload();
      await request(server).post("/api/user")
        .send(payload)
        .set("Accept", "application/json")
        .expect(200, { ok: true, err: null, data: "ok" });
      const user = await db.createQueryBuilder()
        .select("user")
        .from("user", "user")
        .where("email = :email", { email: payload.email.toLowerCase() })
        .getOne();

      expect(user).toBeDefined();
      expect(user?.id).toBeDefined();
      expect(user?.username).toEqual(payload.username);
    });

    it("Should return ValidationError on duplicate email", async () => {
      const payload1 = generateCreatePayload();
      const payload2 = generateCreatePayload();
      payload2.email = payload1.email;
      await request(server).post("/api/user")
        .send(payload1)
        .set("Accept", "application/json")
        .expect(200, { ok: true, err: null, data: "ok" });

      await request(server).post("/api/user")
        .send(payload2)
        .set("Accept", "application/json")
        .expect(200, {
          ok: false,
          err: {
            name: "ValidationError",
            message: "User with that email already exist.",
            extra: { field: "email", message: "User with that email already exist." }
          },
          data: null
        });
    });
  });
  describe("POST /api/user/signin", () => {
    it("Should set cookie on successful signin", async () => {
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await new UserFactory().create({ password: hashedPassword });
      await request(server).post("/api/user/signin")
        .send({
          email: user.email,
          password: password,
        })
        .set("Accept", "application/json")
        .expect(200, { ok: true, err: null, data: "ok" })
        .expect("Set-Cookie", /sessionID=.+; Path=\/;/);
    });

    it("Should return ValidationError on incorrect email", async () => {
      await new UserFactory().create();
      await request(server).post("/api/user/signin")
        .send({
          email: "not-a-match@email.com",
          password: faker.internet.password(),
        })
        .set("Accept", "application/json")
        .expect(200, {
          ok: false,
          err: {
            name: "ValidationError",
            message: "User with that email does not exist.",
            extra: { field: "email", message: "User with that email does not exist." }
          },
          data: null
        });
    });

    it("Should return ValidationError on incorrect password", async () => {
      const user = await new UserFactory().create();
      await request(server).post("/api/user/signin")
        .send({
          email: user.email,
          password: "incorrect-password",
        })
        .set("Accept", "application/json")
        .expect(200, {
          ok: false,
          err: {
            name: "ValidationError",
            message: "Password is incorrect.",
            extra: { field: "password", message: "Password is incorrect." }
          },
          data: null
        });
    });
  });
  describe("GET /api/user/session", () => {
    it("Should return User for signed-in user", async () => {
      const agent = request.agent(server);
      const user = await new UserFactory().createSignedIn(agent);
      const response = await agent
        .get("/api/user/session")
        .expect(200);

      expect(response.body).toEqual({
        ok: true,
        err: null,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
        }
      });
    });

    it("Should return AuthenticationError for non-signed-in user", async () => {
      await request(server)
        .get("/api/user/session")
        .expect(200, {
          ok: false,
          err: { name: "AuthenticationError", message: "You are not logged in." },
          data: null,
        });
    });
  });

  describe("POST /api/user/signout", () => {
    it("Should clear cookie on successful signout", async () => {
      const agent = request.agent(server);
      await new UserFactory().createSignedIn(agent);
      await agent
        .post("/api/user/signout")
        .expect(200)
        .expect("Set-Cookie", /sessionID=;/);
    });
  });
});


