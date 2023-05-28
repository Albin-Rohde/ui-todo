import "reflect-metadata";
import * as dotenv from "dotenv";
import { UserController } from "./user/controller";
import { db } from "./data-source";
import { createExpressServer } from "routing-controllers";
import cors from "cors";
import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";

dotenv.config();

export const init = async (portNumber: number | undefined): Promise<Application> => {
  return new Promise((resolve) => {
    db.initialize().then(async () => {
      const port = portNumber || process.env.PORT || 5000;

      const app = express();
      app.use(cors()); // Enable CORS middleware
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());

      app.get("/health", (req: Request, res: Response) => res.json({ "status": "ok" }));
      const server = createExpressServer({
        controllers: [UserController],
      });


      app.use("/api", server);

      app.listen(port, () => {
        console.log(`Server is running on port ${port}.`);
        resolve(app);
      });
    });
  });
}
