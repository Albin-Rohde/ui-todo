import { DataSource, Repository } from "typeorm";
import { User } from "./entity/User";
import { db } from "../data-source";

export class UserDAO {
  private userRepository: Repository<User>;

  constructor(dataSource: DataSource = db) {
    this.userRepository = dataSource.getRepository(User);
  }

  async getUserByIdOrFail(id: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id: id } });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.userRepository.createQueryBuilder("user")
      .where("user.email = :email", { email: email })
      .getOne();
  }

  async getByUsername(username: string): Promise<User | null> {
    return this.userRepository.createQueryBuilder("user")
      .where("user.username = :username", { username: username })
      .getOne();
  }

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
