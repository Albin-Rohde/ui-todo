import { DataSource } from "typeorm";
import { MemoryStore } from "express-session";

jest.mock("../data-source", () => {
  const originalModule = jest.requireActual("../data-source");

  const createTestDb = () =>
    new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: originalModule.entities,
      synchronize: true,
      logging: false,
      subscribers: [],
    });

  return {
    ...originalModule,
    db: createTestDb(),
  };
});

jest.mock("../redisStore", () => {
  return {
    getRedisStore: jest.fn().mockResolvedValue(new MemoryStore()),
  };
});

