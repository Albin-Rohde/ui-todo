import { Repository } from "typeorm";
import { User } from "./entity/User";
import { db } from "../data-source";

export class UserDAO {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = db.getRepository(User);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOneOrFail({ where: { id: id } });
  }

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

}
