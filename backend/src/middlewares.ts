import { AuthenticationError } from "./error";
import { User } from "./user/entity/User";
import { UserService } from "./user/service";
import { NextFunction, Request, Response } from "express";

const authUser = async (sessionUser: User | undefined) => {
  if (!sessionUser) {
    throw new AuthenticationError("You are not logged in.")
  }
  const userService = new UserService()
  const user = await userService.getUserById(sessionUser.id)
  if (!user) {
    throw new AuthenticationError("User not found")
  }
  return user
}

export const loginRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.user = await authUser(req.session.user)
    req.session.save()
    next()
  } catch (err: any) {
    res.json({
      ok: false,
      err: {
        message: err?.message,
        name: err?.name,
      },
      data: null
    })
  }
}