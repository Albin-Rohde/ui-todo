import { User } from "./user/entity/User";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { AddUserTable1685139437466 } from "./migrations/1685139437466-AddUserTable";
import { TodoList } from "./todolist/entity/TodoList";
import { AddTodoTable1685522666796 } from "./migrations/1685522666796-AddTodoTable";
import { TodoItem } from "./todoitem/entity/TodoItem";
import {
  AddTodoItemTable1685604745524
} from "./migrations/1685604745524-AddTodoItemTable";
import { RecentList } from "./todolist/entity/RecentList";
import {
  AddRecentListTable1685616756505
} from "./migrations/1685616756505-AddRecentListTable";
import { Migration1685698931722 } from "./migrations/1685698931722-migration";
import { Migration1685836052810 } from "./migrations/1685836052810-migration";

dotenv.config();

export const entities = [
  User,
  TodoList,
  TodoItem,
  RecentList
];

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
    AddUserTable1685139437466,
    AddTodoTable1685522666796,
    AddTodoItemTable1685604745524,
    AddRecentListTable1685616756505,
    Migration1685698931722,
    Migration1685836052810,
  ],
});
