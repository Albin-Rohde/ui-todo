import {
  FactorizedAttrs,
  Factory,
  LazyInstanceAttribute,
  SingleSubfactory
} from "@jorgebodega/typeorm-factory";
import { User } from "../user/entity/User";
import { db } from "../data-source";
import { faker } from "@faker-js/faker";
import { SuperAgentTest } from "supertest";
import { hashSync } from "bcrypt";
import { TodoList } from "../todolist/entity/TodoList";

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

export class TodoListFactory extends Factory<TodoList> {
  protected entity = TodoList
  protected dataSource = db

  protected attrs(): FactorizedAttrs<TodoList> {
    return {
      name: faker.lorem.words(2),
      user: new LazyInstanceAttribute((instance) => new SingleSubfactory(UserFactory, { todoLists: [instance] })),
      userId: new LazyInstanceAttribute((instance) => instance.user.id),
    }
  }
}
