import { User } from "./user/entity/User";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { AddUserTable1685139437466 } from "./migrations/1685139437466-AddUserTable";


dotenv.config();

export const entities = [User];

export const db = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: entities,
  subscribers: [],
  migrations: [
    AddUserTable1685139437466
  ],
});

/*
Create migration
npm run typeorm migration:generate -- ./src/migrations/AddUserTable -d ./src/data-source.ts

Run migrations
npm run typeorm migration:run -- -d ./src/data-source.ts
*/
