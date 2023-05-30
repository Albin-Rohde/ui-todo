import { UserDAO } from "./dao";
import { User } from "./entity/User";
import bcrypt from "bcrypt";
import { createUserInput, signInInput } from "./schema";
import { ValidationError } from "yup";
import { AuthenticationError } from "../error";


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

  public async signIn(input: signInInput): Promise<User> {
    const user = await this.userDAO.getByEmail(input.email);
    if (!user) {
      throw new ValidationError(
        "User with that email does not exist.",
        input.email,
        "email"
      );
    }
    const match = await bcrypt.compare(input.password, user.password);
    if (!match) {
      throw new ValidationError(
        "Password is incorrect.",
        input.password,
        "password"
      );
    }
    return user;
  }

  public async authUser(userData: User | undefined | null): Promise<User> {
    if (!userData) {
      throw new AuthenticationError("You are not logged in.")
    }
    const userService = new UserService()
    const user = await userService.getUserById(userData.id)
    if (!user) {
      throw new AuthenticationError("User not found")
    }
    return user
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
