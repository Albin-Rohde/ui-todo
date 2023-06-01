import "reflect-metadata";
import * as dotenv from "dotenv";
import { UserController } from "./user/controller";
import { db } from "./data-source";
import { createExpressServer } from "routing-controllers";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";
import { getRedisStore } from "./redisStore";
import { TodoListController } from "./todolist/controller";
import { TodoItemController } from "./todoitem/controller";

dotenv.config();

export const getExpressApp = async (): Promise<Application> => {
  try {
    await db.initialize();
    const app = express();
    app.use(cors({
      origin: "http://localhost:3000",
      credentials: true
    }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.set("trust proxy", true);
    app.use(session({
      secret: "apa", // TODO: change this
      store: await getRedisStore(),
      resave: false,
      saveUninitialized: false,
      proxy: true,
      name: "sessionID",
      cookie: {
        secure: false, // TODO: true if https
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    }));

    app.get("/health", (req: Request, res: Response) => res.json({ "status": "ok" }));
    const server = createExpressServer({
      controllers: [UserController, TodoListController, TodoItemController],
    });

    app.use("/api", server);
    return app;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
