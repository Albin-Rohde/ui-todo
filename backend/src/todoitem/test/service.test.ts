import { db } from "../../data-source";
import { TodoItemService } from "../service";
import {
  TodoItemFactory,
  TodoListFactory,
  UserFactory
} from "../../test-utils/factories";
import { faker } from "@faker-js/faker";
import { EntityNotFoundError } from "typeorm";

describe("TodoItemService", () => {
  let todoItemService: TodoItemService;

  beforeAll(async () => {
    todoItemService = new TodoItemService();
    await db.initialize();
  });

  afterEach(async () => {
    await db.synchronize(true);
  });

  afterAll(async () => {
    await db.close();
  });

  describe("create", () => {
    it("should create a todoitem linked to list", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const todoItem = await todoItemService.create({
        publicListId: todoList.publicId,
        text: faker.lorem.text(),
        completed: false,
      });
      expect(todoItem).toBeDefined();
      expect(todoItem.id).toBeDefined();
      expect(todoItem.list.id).toEqual(todoList.id);
    });

    it("should not create a todoitem linked to list if list does not exist", async () => {
      const user = await new UserFactory().create();
      await expect(
        todoItemService.create({
          publicListId: faker.string.uuid(),
          text: faker.lorem.text(),
          completed: false,
        })
      ).rejects.toThrowError(EntityNotFoundError);
    });

    it("should create a todoitem linked to list if user does not own list", async () => {
      const user = await new UserFactory().create();
      const user2 = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user: user2 });

      await todoItemService.create({
        publicListId: todoList.publicId,
        text: faker.lorem.text(),
        completed: false,
      });

      const count = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getCount();
      expect(count).toEqual(1);
    });
  });

  describe("update", () => {
    it("should update a todoitem", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      const newText = faker.lorem.text();
      await todoItemService.update({
        id: todoItem.id,
        publicListId: todoList.publicId,
        text: newText,
        completed: true,
      });

      const item = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getOne();
      expect(item).toBeDefined();
      expect(item?.id).toEqual(todoItem.id);
      expect(item?.text).toEqual(newText);
      expect(item?.completed).toEqual(true);
    });
  });
});