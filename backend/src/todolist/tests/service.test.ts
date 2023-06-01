import { db } from "../../data-source";
import { TodoListService } from "../service";
import { TodoListFactory, UserFactory } from "../../test-utils/factories";
import { faker } from "@faker-js/faker";
import { ValidationError } from "yup";

describe("TodolistService", () => {
  let todoListService: TodoListService;

  beforeAll(async () => {
    todoListService = new TodoListService();
    await db.initialize();
  });

  afterEach(async () => {
    await db.synchronize(true);
  });

  afterAll(async () => {
    await db.close();
  });

  describe("create", () => {
    it("should create a todolist linked to the user", async () => {
      const user = await new UserFactory().create();
      const todoList = await todoListService.create(user);
      expect(todoList).toBeDefined();
      expect(todoList.id).toBeDefined();
      expect(todoList.user).toBeDefined();
    });

    it("new lists gets unique name", async () => {
      const user = await new UserFactory().create();
      const todoList = await todoListService.create(user);
      expect(todoList).toBeDefined();
      expect(todoList.name).toEqual("untitled");

      const todoList2 = await todoListService.create(user);
      expect(todoList2).toBeDefined();
      expect(todoList2.name).toEqual("untitled (1)");
    });

    it("Different users can share name", async () => {
      const user = await new UserFactory().create();
      const todoList = await todoListService.create(user);
      expect(todoList).toBeDefined();
      expect(todoList.name).toEqual("untitled");

      const user2 = await new UserFactory().create();
      const todoList2 = await todoListService.create(user2);
      expect(todoList2).toBeDefined();
      expect(todoList2.name).toEqual("untitled");
    });
  });

  describe("getAllByUser", () => {
    it("should return all todolists for the user", async () => {
      const user = await new UserFactory().create();
      await new TodoListFactory().createMany(5, { user });
      const todoLists = await todoListService.getAllByUser(user);
      expect(todoLists).toHaveLength(5);
    });

    it("should return empty array if no todolists for the user", async () => {
      const user = await new UserFactory().create();
      const todoLists = await todoListService.getAllByUser(user);
      expect(todoLists).toHaveLength(0);
    });
  });

  describe("getByPublicId", () => {
    it("should return todolist by public id", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const todoListById = await todoListService.getByPublicId(todoList.publicId);
      expect(todoListById).toBeDefined();
      expect(todoListById?.id).toEqual(todoList.id);
    });
  });

  describe("update", () => {
    it("should update todolist name", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const newName = faker.lorem.words(2);
      const updatedTodoList = await todoListService.update(user, todoList.publicId, newName);
      expect(updatedTodoList).toBeDefined();
      expect(updatedTodoList?.name).toEqual(newName);
    });

    it("should throw on non unique name", async () => {
      const user = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user });
      const todoList2 = await new TodoListFactory().create({ user });
      await expect(
        todoListService.update(user, todoList.publicId, todoList2.name)
      ).rejects.toThrowError(ValidationError);
    });
  });
});