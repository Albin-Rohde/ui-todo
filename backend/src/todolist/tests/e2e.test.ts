import { Server } from "http";
import { getTestServer } from "../../test-utils/testServer";
import { db } from "../../data-source";
import request from "supertest";
import { TodoListFactory, UserFactory } from "../../test-utils/factories";
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

  describe("POST /api/todo-list", () => {
    it("Should create todo-list with untitled as name", async () => {
      const agent = request.agent(server);
      await new UserFactory().createSignedIn(agent);

      await agent.post("/api/todo-list")
        .set("Accept", "application/json")
        .expect(200);

      const todoList = await db.createQueryBuilder()
        .select("todo_list")
        .from("todo_list", "todo_list")
        .getOne();

      expect(todoList).toBeDefined();
      expect(todoList?.id).toBeDefined();
      expect(todoList?.name).toEqual("untitled");
    });

    it("Creates todos with untitled (n) as consecutive names", async () => {
      const agent = request.agent(server);
      await new UserFactory().createSignedIn(agent);

      await agent.post("/api/todo-list")
        .set("Accept", "application/json")
        .expect(200);

      await agent.post("/api/todo-list")
        .set("Accept", "application/json")
        .expect(200);

      await agent.post("/api/todo-list")
        .set("Accept", "application/json")
        .expect(200);

      const todoLists = await db.createQueryBuilder()
        .select("todo_list")
        .from("todo_list", "todo_list")
        .getMany();

      expect(todoLists).toBeDefined();
      expect(todoLists.length).toEqual(3);
      expect(todoLists[0].name).toEqual("untitled");
      expect(todoLists[1].name).toEqual("untitled (1)");
      expect(todoLists[2].name).toEqual("untitled (2)");
    });
  });

  describe("GET /api/todo-list/my", () => {
    it("Should return todo-lists for user", async () => {
      const agent = request.agent(server);
      const user = await new UserFactory().createSignedIn(agent);
      await new TodoListFactory().createMany(5, { user });

      const response = await agent.get("/api/todo-list/my")
        .set("Accept", "application/json")
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toEqual(5);
    });
  });

  describe("PUT /api/todo-list/:id", () => {
    it("Should update todo-list name", async () => {
      const agent = request.agent(server);
      const user = await new UserFactory().createSignedIn(agent);
      const todoList = await new TodoListFactory().create({ user });

      const newName = faker.lorem.words(2);
      await agent.put(`/api/todo-list/${todoList.publicId}`)
        .send({ name: newName })
        .expect(200);

      const updatedTodoList = await db.createQueryBuilder()
        .select("todo_list")
        .from("todo_list", "todo_list")
        .where("id = :id", { id: todoList.id })
        .getOne();

      expect(updatedTodoList).toBeDefined();
      expect(updatedTodoList?.name).toEqual(newName);
    });

    it("Should return NotFoundError if todo-list does not exist", async () => {
      const agent = request.agent(server);
      await new UserFactory().createSignedIn(agent);

      await agent.put("/api/todo-list/bad-id")
        .send({ name: faker.lorem.words(2) })
        .expect(200, {
          ok: false,
          err: {
            name: "NotFoundError",
            message: "resource could not be found",
          },
          data: null,
        });
    });
  });

  describe("GET /api/todo-list/:id", () => {
    it("Should return todo-list", async () => {
      const agent = request.agent(server);
      const user = await new UserFactory().createSignedIn(agent);
      const todoList = await new TodoListFactory().create({ user });

      const response = await agent.get(`/api/todo-list/${todoList.publicId}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toEqual(todoList.id);
      expect(response.body.data.publicId).toEqual(todoList.publicId);
    });

    it("Should return NotFoundError if todo-list does not exist", async () => {
      const agent = request.agent(server);
      await new UserFactory().createSignedIn(agent);

      await agent.get("/api/todo-list/bad-id")
        .send({ name: faker.lorem.words(2) })
        .expect(200, {
          ok: false,
          err: {
            name: "NotFoundError",
            message: "resource could not be found",
          },
          data: null,
        });
    });

    it("Should save to 'RecentList' if viewing other users todo-list", async () => {
      const owningUser = await new UserFactory().create();
      const todoList = await new TodoListFactory().create({ user: owningUser });
      const agent = request.agent(server);
      const user = await new UserFactory().createSignedIn(agent);

      await agent.get(`/api/todo-list/${todoList.publicId}`)
        .expect(200);

      const recentList = await db.createQueryBuilder()
        .select("recent_todo_list")
        .from("recent_todo_list", "recent_todo_list")
        .where("user_id = :userId", { userId: user.id })
        .andWhere("list_id = :todoListId", { todoListId: todoList.id })
        .getOne();

      expect(recentList).toBeDefined();
      expect(recentList?.listId).toEqual(todoList.id);
    });
  });
});