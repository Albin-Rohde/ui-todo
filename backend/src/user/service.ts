import { User } from "./entity/User";
import bcrypt from "bcrypt";
import { createUserInput, signInInput } from "./schema";
import { ValidationError } from "yup";
import { AuthenticationError } from "../error";
import { Repository } from "typeorm";
import { db } from "../data-source";


export class UserService {
  constructor(private readonly userRepository: Repository<User> = db.getRepository(User)) {
  }

  public async createUser(userData: createUserInput): Promise<User> {
    const userByEmail = await this.userRepository.findOne({ where: { email: userData.email.toLowerCase() } })
    if (userByEmail) {
      throw new ValidationError(
        "User with that email already exist.",
        userData.email,
        "email"
      );
    }
    const userByUsername = await this.userRepository.findOne({ where: { username: userData.username } })
    if (userByUsername) {
      throw new ValidationError(
        "User with that username already exist.",
        userData.username,
        "username"
      );
    }
    const user = new User();
    user.username = userData.username;
    user.email = userData.email.toLowerCase();
    user.password = await this.hashPassword(userData.password);
    return this.userRepository.save(user);
  }

  public async signIn(input: signInInput): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: input.email.toLowerCase() } })
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
    const user = await this.userRepository.findOne({ where: { id: userData.id } })
    if (!user) {
      throw new AuthenticationError("User not found")
    }
    return user
  }

  public getUserResponseFromUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
