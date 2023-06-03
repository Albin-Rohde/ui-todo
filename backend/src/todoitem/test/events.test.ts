import { faker } from "@faker-js/faker";
import { db } from "../../data-source";
import { TodoItemFactory, TodoListFactory } from "../../test-utils/factories";
import {
  handleNotifyNewItem,
  handleUpdateCursorPos,
  handleUpdateTodoItem
} from "../events";
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

  describe("todoitem.notify-new-todo-item", () => {
    it("should broadcast that a new item has been created", async () => {
      const todoList = await new TodoListFactory().create();
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      await handleNotifyNewItem(socket as unknown as Socket)({
        listId: todoList.publicId,
        id: todoItem.id
      });

      expect(mockTo).toHaveBeenCalledWith(todoList.publicId);
      expect(mockEmit).toHaveBeenCalledWith("todoitem.item-created", {
        id: 1,
        text: todoItem.text,
        completed: todoItem.completed,
        listId: todoList.id,
      });
    });

    it("should not broadcast a todoitem if list does not exist", async () => {
      const text = faker.lorem.sentence();
      await handleNotifyNewItem(socket as unknown as Socket)({
        listId: faker.string.uuid(),
        id: faker.number.int({ min: 1, max: 1000 }),
      });

      expect(mockTo).not.toHaveBeenCalled();
      expect(mockEmit).not.toHaveBeenCalled();
    });

    it("should not broadcast a todoitem if item does not exist", async () => {
      const todoList = await new TodoListFactory().create();

      await handleNotifyNewItem(socket as unknown as Socket)({
        listId: todoList.publicId,
        id: faker.number.int({ min: 1, max: 1000 }),
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

  describe("todoitem.update-cursor-pos", () => {
    it("should update position and broadcast the updated position, along with the user who made the update", async () => {
      const todoList = await new TodoListFactory().create();
      const todoItem = await new TodoItemFactory().create({ list: todoList });

      const cursorStart = faker.number.int({ min: 0, max: 80 });
      const cursorEnd = faker.number.int({ min: 80, max: 100 });
      await handleUpdateCursorPos(socket as unknown as Socket)({
        listId: todoList.publicId,
        itemId: todoItem.id,
        cursorStart,
        cursorEnd,
      });

      expect(mockTo).toHaveBeenCalledWith(todoItem.list.publicId);
      expect(mockEmit).toHaveBeenCalledWith("todoitem.cursor-pos-updated", {
        itemId: todoItem.id,
        listId: todoItem.list.publicId,
        cursorStart,
        cursorEnd,
        userId: socket.request.session.user.id,
      });
    });

    it("should not update cursor position if list does not exist", async () => {
      const todoItem = await new TodoItemFactory().create();

      await handleUpdateCursorPos(socket as unknown as Socket)({
        listId: faker.string.uuid(),
        itemId: todoItem.id,
        cursorStart: faker.number.int({ min: 0, max: 80 }),
        cursorEnd: faker.number.int({ min: 80, max: 100 }),
      });

      expect(mockTo).not.toHaveBeenCalled();
      expect(mockEmit).not.toHaveBeenCalled();
    });

    it("should not update cursor position if item does not exist", async () => {
      const todoList = await new TodoListFactory().create();

      await handleUpdateCursorPos(socket as unknown as Socket)({
        itemId: faker.number.int({ min: 1, max: 1000 }),
        listId: todoList.publicId,
        cursorStart: faker.number.int({ min: 0, max: 80 }),
        cursorEnd: faker.number.int({ min: 80, max: 100 }),
      });

      expect(mockTo).not.toHaveBeenCalled();
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });
});