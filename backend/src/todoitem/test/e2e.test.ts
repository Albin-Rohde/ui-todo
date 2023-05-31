import { Server } from "http";
import { getTestServer } from "../../test-utils/testServer";
import { db } from "../../data-source";
import request from "supertest";
import {
  TodoItemFactory,
  TodoListFactory,
  UserFactory
} from "../../test-utils/factories";
import { faker } from "@faker-js/faker";

describe("User rest routes", () => {
  let server: Server;

  beforeAll(async () => {
    server = await getTestServer()
  });

  afterEach(async () => {
    await db.synchronize(true)
  });

  afterAll(async () => {
    await db.close();
    server.close();
  });

  describe("POST /api/todo-list/:listId/", () => {
    it("should create a todoitem linked to list", async () => {
      const agent = request.agent(server);
      const user = await new UserFactory().createSignedIn(agent);
      const todoList = await new TodoListFactory().create({ user });

      await agent.post(`/api/todo-list/${todoList.publicId}/todo-item`)
        .send({
          text: "test",
          completed: false,
        })
        .expect(200);

      const todoItem = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getOne();

      expect(todoItem).toBeDefined();
      expect(todoItem?.id).toBeDefined();
      expect(todoItem?.listId).toEqual(todoList.id);
    });

    it("should default complete to false", async () => {
      const agent = request.agent(server);
      const user = await new UserFactory().createSignedIn(agent);
      const todoList = await new TodoListFactory().create({ user });

      await agent.post(`/api/todo-list/${todoList.publicId}/todo-item`)
        .send({
          text: "test",
        })
        .expect(200);

      const todoItem = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getOne();

      expect(todoItem?.completed).toEqual(false);
    });

    it("should create a todoitem with the given text", async () => {
      const agent = request.agent(server);
      const user = await new UserFactory().createSignedIn(agent);
      const todoList = await new TodoListFactory().create({ user });
      const text = faker.lorem.words(3);

      await agent.post(`/api/todo-list/${todoList.publicId}/todo-item`)
        .send({
          text,
        })
        .expect(200);

      const todoItem = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getOne();

      expect(todoItem?.text).toEqual(text);
    });
  });

  describe("PUT /api/todo-list/:listId/todo-item/:itemId", () => {
    it("should update the todoitem", async () => {
      const agent = request.agent(server);
      const user = await new UserFactory().createSignedIn(agent);
      const todoList = await new TodoListFactory().create({ user });
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      const text = faker.lorem.words(3);
      const completed = true;

      await agent.put(`/api/todo-list/${todoList.publicId}/todo-item/${todoItem.id}`)
        .send({
          text,
          completed,
        })
        .expect(200);

      const updatedTodoItem = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getOne();

      expect(updatedTodoItem?.text).toEqual(text);
      expect(updatedTodoItem?.completed).toEqual(completed);
    });

    it("should not update the todoitem if the user is not the owner", async () => {
      const agent = request.agent(server);
      const listOwner = await new UserFactory().create();
      await new UserFactory().createSignedIn(agent);
      const todoList = await new TodoListFactory().create({ user: listOwner });
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      const newText = faker.lorem.words(3);

      await agent.put(`/api/todo-list/${todoList.publicId}/todo-item/${todoItem.id}`)
        .send({
          newText,
        })
        .expect(200, {
          ok: false,
          err: {
            name: "NotFoundError",
            message: "resource could not be found",
          },
          data: null,
        })

      const updatedTodoItem = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getOne();

      expect(updatedTodoItem?.text).not.toEqual(newText);
    });
  });

  describe("DELETE /api/todo-list/:listId/todo-item/:itemId", () => {
    it("should delete the todoitem", async () => {
      const agent = request.agent(server);
      const user = await new UserFactory().createSignedIn(agent);
      const todoList = await new TodoListFactory().create({ user });
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      await agent.delete(`/api/todo-list/${todoList.publicId}/todo-item/${todoItem.id}`)
        .expect(200);

      const deletedTodoItem = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getOne();

      expect(deletedTodoItem).toBeNull();
    });

    it("should not delete the todoitem if the user is not the owner", async () => {
      const agent = request.agent(server);
      const listOwner = await new UserFactory().create();
      await new UserFactory().createSignedIn(agent);
      const todoList = await new TodoListFactory().create({ user: listOwner });
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      await agent.delete(`/api/todo-list/${todoList.publicId}/todo-item/${todoItem.id}`)
        .expect(200, {
          ok: false,
          err: {
            name: "NotFoundError",
            message: "resource could not be found",
          },
          data: null,
        })

      const deletedTodoItem = await db.createQueryBuilder()
        .select("todo_item")
        .from("todo_item", "todo_item")
        .getOne();

      expect(deletedTodoItem).toBeDefined();
    });
  });
});