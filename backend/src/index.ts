import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";

dotenv.config();

const app = express();

AppDataSource.initialize().then(async () => {
  const port = process.env.PORT || 5000;
  app.get("/", (req, res) => {
    res.send("Hello World!")
  })
  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
});
