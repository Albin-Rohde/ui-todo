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
        user,
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
          user,
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
        user,
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

    it("should create a todoitem linked to parent item", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const parentItem = await new TodoItemFactory().create({ list: todoList });

      const text = faker.lorem.text();
      const todoItem = await todoItemService.create({
        user,
        publicListId: todoList.publicId,
        text: text,
        completed: false,
        parentId: parentItem.id,
      });
      expect(todoItem).toBeDefined();
      expect(todoItem.id).toBeDefined();
      expect(todoItem.list.id).toEqual(todoList.id);
      expect(todoItem.parentItemId).toEqual(parentItem.id);

      const subItem = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .where("todo_item.id = :id", { id: todoItem.id })
        .getOne();
      expect(subItem?.id).toEqual(todoItem.id);
      expect(subItem?.parentItemId).toEqual(parentItem.id);
      expect(subItem?.text).toEqual(text);
    });
  });

  describe("update", () => {
    it("should update a todoitem", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      const newText = faker.lorem.text();
      await todoItemService.update({
        user,
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