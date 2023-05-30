import { UserService } from "./user/service";
import { NextFunction, Request, Response } from "express";

const userService = new UserService()

export const loginRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.user = await userService.authUser(req.session.user)
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