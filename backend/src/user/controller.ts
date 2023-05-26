import { Body, Controller, Get, Post } from "routing-controllers";
import { createUserInput, createUserSchema } from "./schema";
import { UserService } from "./service";
import { handleErrors } from "../decorators";
import { RestResponse } from "../types";


@Controller("/user")
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService | null = null) {
    this.userService = userService || new UserService() as UserService
  }

  @handleErrors
  @Get("/session")
  getStatus() {
    return true;
  }

  @handleErrors
  @Post("/")
  async createUser(@Body() user: createUserInput): Promise<RestResponse<"ok">> {
    const userData = await createUserSchema.validate(user);
    await this.userService.createUser(userData);
    return {
      ok: true,
      err: null,
      data: "ok",
    };
  }
}
