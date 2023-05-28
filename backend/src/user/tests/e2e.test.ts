import request from "supertest";
import "reflect-metadata";
import { db } from "../../data-source";
import { Server } from "http";
import { getTestServer } from "../../test-utils/testServer";

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

  it("Should create user", () => {
    return request(server).post("/api/user")
      .send({
        username: "test",
        email: "test@example.com",
        password: "test",
        passwordConfirmation: "test",
      })
      .set("Accept", "application/json")
      .expect(200, { ok: true, err: null, data: "ok" });
  });

  it("Should return ValidationError on duplicate email", async () => {
    await request(server).post("/api/user")
      .send({
        username: "test",
        email: "test@example.com",
        password: "test",
        passwordConfirmation: "test",
      })
      .set("Accept", "application/json")
      .expect(200, { ok: true, err: null, data: "ok" });

    return request(server).post("/api/user")
      .send({
        username: "test",
        email: "test@example.com",
        password: "test",
        passwordConfirmation: "test",
      })
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
})