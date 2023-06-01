import { faker } from "@faker-js/faker";
import { db } from "../../data-source";
import { TodoItemFactory, TodoListFactory } from "../../test-utils/factories";
import { handleCreateTodoItem, handleUpdateTodoItem } from "../events";
import { Socket } from "socket.io";

const mockEmit = jest.fn();
const mockTo = jest.fn().mockReturnValue({
  emit: mockEmit,
})

const socket = {
  request: {
    session: {
      user: {
        id: faker.number.int({ min: 1, max: 1000 }),
      },
    },
  },
  broadcast: {
    to: mockTo,
  }
};

describe("TodoItem EventHandlers", () => {
  beforeAll(async () => {
    await db.initialize();
  });

  afterEach(async () => {
    await db.synchronize(true);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await db.close();
  });

  describe("todoitem.create", () => {
    it("should create a todoitem and broadcast the new item", async () => {
      const todoList = await new TodoListFactory().create();

      const text = faker.lorem.sentence();
      await handleCreateTodoItem(socket as unknown as Socket)({
        listId: todoList.publicId,
        text: text,
        completed: true
      });

      expect(mockTo).toHaveBeenCalledWith(todoList.publicId);
      expect(mockEmit).toHaveBeenCalledWith("todoitem.item-created", {
        id: 1,
        text: text,
        completed: true,
        listId: todoList.id,
      });
    });

    it("should not create a todoitem if list does not exist", async () => {
      const text = faker.lorem.sentence();
      await handleCreateTodoItem(socket as unknown as Socket)({
        listId: faker.string.uuid(),
        text: text,
        completed: true
      });

      expect(mockTo).not.toHaveBeenCalled();
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  describe("todoitem.update", () => {
    it("should update a todoitem and broadcast the updated item", async () => {
      const todoList = await new TodoListFactory().create();
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      const text = faker.lorem.sentence();
      await handleUpdateTodoItem(socket as unknown as Socket)({
        id: todoItem.id,
        listId: todoList.publicId,
        text: text,
        completed: true
      });

      expect(mockTo).toHaveBeenCalledWith(todoItem.list.publicId);
      expect(mockEmit).toHaveBeenCalledWith("todoitem.item-updated", {
        id: todoItem.id,
        text: text,
        completed: true,
        listId: todoItem.list.id,
      });
    });

    it("should not update a todoitem if list does not exist", async () => {
      const todoItem = await new TodoItemFactory().create();

      const text = faker.lorem.sentence();
      await handleUpdateTodoItem(socket as unknown as Socket)({
        id: todoItem.id,
        listId: faker.string.uuid(),
        text: text,
        completed: true
      });

      expect(mockTo).not.toHaveBeenCalled();
      expect(mockEmit).not.toHaveBeenCalled();
    });

    it("should not update a todoitem if item does not exist", async () => {
      const todoList = await new TodoListFactory().create();

      const text = faker.lorem.sentence();
      await handleUpdateTodoItem(socket as unknown as Socket)({
        id: faker.number.int({ min: 1, max: 1000 }),
        listId: todoList.publicId,
        text: text,
        completed: true
      });

      expect(mockTo).not.toHaveBeenCalled();
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });
});