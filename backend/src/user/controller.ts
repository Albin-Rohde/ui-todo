import { Body, Controller, Get, Post, Req, UseBefore } from "routing-controllers";
import { createUserInput, createUserSchema, signInInput, signInSchema } from "./schema";
import { UserService } from "./service";
import { CurrentUser, HandleErrors } from "../decorators";
import { RestResponse } from "../types";
import { loginRequired } from "../middlewares";
import { Request } from "express";
import { User } from "./entity/User";
import { UserResponse } from "./ResponseTypes";


@Controller("/user")
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService | null = null) {
    this.userService = userService || new UserService() as UserService
  }

  @HandleErrors
  @Get("/session")
  @UseBefore(loginRequired)
  getStatus(@CurrentUser() user: User): RestResponse<UserResponse> {
    return {
      ok: true,
      err: null,
      data: this.userService.getUserResponseFromUser(user),
    }
  }

  @HandleErrors
  @Post("/")
  async createUser(@Req() req: Request, @Body() data: createUserInput): Promise<RestResponse<"ok">> {
    const userData = await createUserSchema.validate(data);
    req.session.user = await this.userService.createUser(userData);
    req.session.save();
    return {
      ok: true,
      err: null,
      data: "ok",
    };
  }

  @HandleErrors
  @Post("/signin")
  async signIn(@Req() req: Request, @Body() data: signInInput): Promise<RestResponse<"ok">> {
    const userData = await signInSchema.validate(data);
    req.session.user = await this.userService.signIn(userData);
    req.session.save();
    return {
      ok: true,
      err: null,
      data: "ok",
    };
  }
}
