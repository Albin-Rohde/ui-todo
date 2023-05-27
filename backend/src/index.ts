import "reflect-metadata";
import * as dotenv from "dotenv";
import { UserController } from "./user/controller";
import { db } from "./data-source";
import { createExpressServer } from "routing-controllers";
import { Response } from "express";

dotenv.config();

db.initialize().then(async () => {
  const port = process.env.PORT || 5000;

  const app = createExpressServer({
    controllers: [UserController],
  });

  app.get("/health", (req: Request, res: Response) => res.json({ "status": "ok" }));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
});
