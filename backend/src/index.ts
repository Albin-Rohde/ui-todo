import { getExpressApp, getSessionHandler } from "./express";
import { User } from "./user/entity/User";
import http from "http";
import { initializeSocketServer } from "./socketIO";

/** Setup for express-session **/
declare module "express-session" {
  export interface SessionData {
    user: User // This is what we store with the session
    save: (...args: any[]) => void
    destroy: (...args: any[]) => void
  }
}

/** Setup session typing for websockets **/
declare module "http" {
  export interface IncomingMessage {
    session: {
      user: User
      save: (...args: any[]) => void
      destroy: (...args: any[]) => void
      readonly id: string,
    }
  }
}

const start = async () => {
  const userSessionHandler = await getSessionHandler();
  const expressApp = await getExpressApp(userSessionHandler);
  const server = http.createServer(expressApp);
  initializeSocketServer(server, userSessionHandler);

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
}

start();