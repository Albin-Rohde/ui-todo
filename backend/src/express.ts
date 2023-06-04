import "reflect-metadata";
import * as dotenv from "dotenv";
import { UserController } from "./user/controller";
import { db } from "./data-source";
import { createExpressServer } from "routing-controllers";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import express, {
  Application,
  Request,
  RequestHandler,
  Response,
  Router,
  static as express_static
} from "express";
import { getRedisStore } from "./redisStore";
import { TodoListController } from "./todolist/controller";
import { TodoItemController } from "./todoitem/controller";
import path from "path";

dotenv.config();

export const getExpressApp = async (session: RequestHandler): Promise<Application> => {
  try {
    await db.initialize();
    const app = express();

    if (process.env.NODE_ENV !== "production") {
      // Allow CORS for development
      app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
      }));
    }
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.set("trust proxy", true);
    app.use(session);

    app.get("/health", (req: Request, res: Response) => res.json({ "status": "ok" }));
    const server = createExpressServer({
      controllers: [UserController, TodoListController, TodoItemController],
    });

    app.use("/api", server);

    // Serve react app if in production
    if (process.env.NODE_ENV === "production") {
      const reactRouter = Router();
      const staticPath = path.join(__dirname, "..", "..", "frontend", "build")
      const reactStatic = express_static(staticPath)
      const reactPaths = ["/", "/list/:id", "/signin", "/signup"]
      reactPaths.forEach((path) => {
        reactRouter.use(path, reactStatic)
      })
      app.use("/", reactRouter);
    }

    return app;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const getSessionHandler = async () => {
  return session({
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
  });
}
