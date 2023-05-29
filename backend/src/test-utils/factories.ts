import { FactorizedAttrs, Factory } from "@jorgebodega/typeorm-factory";
import { User } from "../user/entity/User";
import { db } from "../data-source";
import { faker } from "@faker-js/faker";
import { SuperAgentTest } from "supertest";
import { hashSync } from "bcrypt";

export class UserFactory extends Factory<User> {
  protected entity = User
  protected dataSource = db

  protected attrs(): FactorizedAttrs<User> {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  }

  public async createSignedIn(agent: SuperAgentTest, attrs?: FactorizedAttrs<User>) {
    const password: string = attrs?.password as string || faker.internet.password();
    const user = await this.create({
      ...attrs, password: hashSync(password, 10)
    });
    await agent.post("/api/user/signin")
      .send({ email: user.email, password })
      .expect(200, { ok: true, err: null, data: "ok" })
      .set("Content-Type", "application/json")
    return user;
  }
}
