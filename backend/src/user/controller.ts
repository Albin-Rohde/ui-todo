import { Body, Controller, Get, Post, Req, Res, UseBefore } from "routing-controllers";
import { createUserInput, createUserSchema, signInInput, signInSchema } from "./schema";
import { UserService } from "./service";
import { CurrentUser, HandleErrors } from "../decorators";
import { loginRequired } from "../middlewares";
import { Request, Response } from "express";
import { User } from "./entity/User";


@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {
  }

  @HandleErrors
  @Get("/session")
  @UseBefore(loginRequired)
  getStatus(@CurrentUser() user: User) {
    return {
      ok: true,
      err: null,
      data: this.userService.getUserResponseFromUser(user),
    }
  }

  @HandleErrors
  @Post("/")
  async createUser(@Req() req: Request, @Body() data: createUserInput) {
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
  async signIn(@Req() req: Request, @Body() data: signInInput) {
    const userData = await signInSchema.validate(data);
    req.session.user = await this.userService.signIn(userData);
    req.session.save();
    return {
      ok: true,
      err: null,
      data: "ok",
    };
  }

  @HandleErrors
  @Post("/signout")
  @UseBefore(loginRequired)
  async signOut(@Req() req: Request, @Res() res: Response) {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy(() => resolve());
    })
    res.clearCookie("sessionID")
    return {
      ok: true,
      err: null,
      data: "ok",
    };
  }
}
