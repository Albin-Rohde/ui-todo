import { UserDAO } from "./dao";
import { User } from "./entity/User";
import bcrypt from "bcrypt";
import { createUserInput } from "./schema";
import { ValidationError } from "yup";

export class UserService {
  private userDAO: UserDAO;

  constructor(userDAO: UserDAO = new UserDAO()) {
    this.userDAO = userDAO;
  }

  public async createUser(userData: createUserInput): Promise<User> {
    const userByEmail = await this.userDAO.getByEmail(userData.email);
    if (userByEmail) {
      throw new ValidationError(
        "User with that email already exist.",
        userData.email,
        "email"
      );
    }
    const userByUsername = await this.userDAO.getByUsername(userData.username);
    if (userByUsername) {
      throw new ValidationError(
        "User with that username already exist.",
        userData.username,
        "username"
      );
    }
    const user = new User();
    user.username = userData.username;
    user.email = userData.email;
    user.password = await this.hashPassword(userData.password);
    return this.userDAO.createUser(user);
  }

  public async getUserById(id: string): Promise<User | undefined> {
    return this.userDAO.getUserByIdOrFail(id);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
