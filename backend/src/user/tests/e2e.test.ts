import request from "supertest";
import "reflect-metadata";
import { db } from "../../data-source";
import { Server } from "http";
import { getTestServer } from "../../test-utils/testServer";
import { generateCreatePayload } from "../../test-utils/payload";

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
        .where("email = :email", { email: payload.email })
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

      return request(server).post("/api/user")
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
})