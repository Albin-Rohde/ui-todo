import { Server } from "http";
import { getExpressApp } from "../app";

export const getTestServer = async (): Promise<Server> => {
  const app = await getExpressApp();
  return new Promise<Server>((resolve) => {
    const server = app.listen(0, () => {
      resolve(server);
    });
  });
}