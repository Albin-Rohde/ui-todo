import { Server } from "http";
import { getExpressApp, getSessionHandler } from "../express";

export const getTestServer = async (): Promise<Server> => {
  const session = await getSessionHandler();
  const app = await getExpressApp(session);
  return new Promise<Server>((resolve) => {
    const server = app.listen(0, () => {
      resolve(server);
    });
  });
}