import { Request } from "express"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ExpressReqMock = {
  session: {
    save: jest.fn(),
    user: null,
  }
} as Request