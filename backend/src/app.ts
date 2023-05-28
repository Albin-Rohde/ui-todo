import "reflect-metadata";
import * as dotenv from "dotenv";
import { UserController } from "./user/controller";
import { db } from "./data-source";
import { createExpressServer } from "routing-controllers";
import cors from "cors";
import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";

dotenv.config();

export const getExpressApp = async (): Promise<Application> => {
  return new Promise<Application>((resolve, reject) => {
    db.initialize().then(async () => {
      const app = express();
      app.use(cors()); // Enable CORS middleware
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());

      app.get("/health", (req: Request, res: Response) => res.json({ "status": "ok" }));
      const server = createExpressServer({
        controllers: [UserController],
      });
      app.use("/api", server);
      resolve(app);
    });
  });
}
