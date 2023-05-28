import { DataSource } from "typeorm";

jest.mock("../data-source", () => {
  const originalModule = jest.requireActual("../data-source");

  const createTestDb = () => new DataSource({
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
