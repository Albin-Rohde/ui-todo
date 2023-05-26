import "reflect-metadata";
import express from "express";
import {createConnection} from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

createConnection()
  .then(async () => {
    console.log("Connected to the database.");

    app.get("/", (req, res) => {
      res.send("Hello World!")
    })

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  })
  .catch((error) => console.log(error));

