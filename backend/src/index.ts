import { getExpressApp } from "./app";
import { User } from "./user/entity/User";

/** Setup for express-session **/
declare module "express-session" {
  export interface SessionData {
    user: User // This is what we store with the session
    save: (...args: any[]) => void
    destroy: (...args: any[]) => void
  }
}

const start = async () => {
  const app = await getExpressApp();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
}

start();