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

    it("Should not create a todoitem if user does not own list and list is private", async () => {
      const user = await new UserFactory().create();
      const user2 = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user: user2, private: true });

      await expect(
        todoItemService.create({
          user,
          publicListId: todoList.publicId,
          text: faker.lorem.text(),
          completed: false,
        })
      ).rejects.toThrowError(EntityNotFoundError);
    });

    it("Shouuld not create a todoitem if user does not own list and list is readonly", async () => {
      const user = await new UserFactory().create();
      const user2 = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({
        user: user2,
        readonly: true
      });

      await expect(
        todoItemService.create({
          user,
          publicListId: todoList.publicId,
          text: faker.lorem.text(),
          completed: false,
        })
      ).rejects.toThrowError(Error);
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

    it("Update complete status should update all subitems", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const parentItem = await new TodoItemFactory().create({ list: todoList });
      const todoItem = await new TodoItemFactory().create({
        list: todoList,
        parentItemId: parentItem.id
      });

      const newText = faker.lorem.text();
      await todoItemService.update({
        user,
        id: parentItem.id,
        publicListId: todoList.publicId,
        text: newText,
        completed: true,
      });

      const item = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .where("todo_item.id = :id", { id: todoItem.id })
        .getOne();
      expect(item).toBeDefined();
      expect(item?.id).toEqual(todoItem.id);
      expect(item?.completed).toEqual(true);
    });

    it("Should not update todoitem if user does not own list and list is readonly", async () => {
      const user = await new UserFactory().create();
      const user2 = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({
        user: user2,
        readonly: true
      });
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      await expect(
        todoItemService.update({
          user,
          id: todoItem.id,
          publicListId: todoList.publicId,
          text: faker.lorem.text(),
          completed: false,
        })
      ).rejects.toThrowError(Error);
    });
  });

  describe("delete", () => {
    it("should delete a todoitem", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      await todoItemService.delete({
        user,
        id: todoItem.id,
        publicListId: todoList.publicId,
      });

      const count = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getCount();
      expect(count).toEqual(0);
    });

    it("should not delete a todoitem if user does not own list and list is readonly", async () => {
      const user = await new UserFactory().create();
      const user2 = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({
        user: user2,
        readonly: true
      });
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      await expect(todoItemService.delete({
        user,
        id: todoItem.id,
        publicListId: todoList.publicId,
      })).rejects.toThrowError(Error);

      const count = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getCount();
      expect(count).toEqual(1);
    });


    it("should not delete a todoitem if todoitem does not belong to list", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const todoItem = await new TodoItemFactory().create();

      await expect(
        todoItemService.delete({
          user,
          id: todoItem.id,
          publicListId: todoList.publicId,
        })
      ).rejects.toThrowError(EntityNotFoundError);
    });

    it("should delete subitem of a todoitem", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const todoItem = await new TodoItemFactory().create({ list: todoList });
      const subItem = await new TodoItemFactory().create({
        list: todoList,
        parentItemId: todoItem.id
      });

      await todoItemService.delete({
        user,
        id: todoItem.id,
        publicListId: todoList.publicId,
      });

      const count = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getCount();
      expect(count).toEqual(0);
    });

    it("should delete 'infinite' levels of subitem of a todoitem", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const todoItem = await new TodoItemFactory().create({ list: todoList });
      const subItem = await new TodoItemFactory().create({
        list: todoList,
        parentItemId: todoItem.id
      });
      const subitem2 = await new TodoItemFactory().create({
        list: todoList,
        parentItemId: subItem.id
      });
      const subitem3 = await new TodoItemFactory().create({
        list: todoList,
        parentItemId: subitem2.id
      });
      const subitem4 = await new TodoItemFactory().create({
        list: todoList,
        parentItemId: subitem3.id
      });

      await todoItemService.delete({
        user,
        id: todoItem.id,
        publicListId: todoList.publicId,
      });

      const count = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getCount();
      expect(count).toEqual(0);
    });
  });
});