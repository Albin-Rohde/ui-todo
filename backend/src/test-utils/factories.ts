import { FactorizedAttrs, Factory } from "@jorgebodega/typeorm-factory";
import { User } from "../user/entity/User";
import { db } from "../data-source";
import { faker } from "@faker-js/faker";

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
}
