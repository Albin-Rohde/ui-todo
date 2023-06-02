import { handleJoinRoom, handleLeaveRoom } from "../events";
import { Socket } from "socket.io";
import { TodoListFactory } from "../../test-utils/factories";
import { db } from "../../data-source";
import { faker } from "@faker-js/faker";

const socket = {
  join: jest.fn(),
  emit: jest.fn(),
  leave: jest.fn(),
  request: {
    session: {
      user: {
        id: faker.number.int({ min: 1, max: 1000 }),
      }
    }
  }
}

describe("TodoList EventHandlers", () => {
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

  describe("todolist.join-room", () => {
    it("should join room and emit 'joined' event", async () => {
      const todoList = await new TodoListFactory().create();

      await handleJoinRoom(socket as unknown as Socket)({ id: todoList.publicId });

      expect(socket.join).toHaveBeenCalledWith(todoList.publicId);
      expect(socket.emit).toHaveBeenCalledWith("joined", todoList.publicId);
    });

    it("should not join room if list does not exist", async () => {
      await handleJoinRoom(socket as unknown as Socket)({ id: faker.string.uuid() });

      expect(socket.join).not.toHaveBeenCalled();
      expect(socket.emit).not.toHaveBeenCalled();
    });
  });

  describe("todolist.leave-room", () => {
    it("should leave room and emit 'left' event", async () => {
      const todoList = await new TodoListFactory().create();

      await handleLeaveRoom(socket as unknown as Socket)({ id: todoList.publicId });

      expect(socket.leave).toHaveBeenCalledWith(todoList.publicId);
      expect(socket.emit).toHaveBeenCalledWith("left", todoList.publicId);
    });

    it("should not leave room if list does not exist", async () => {
      await handleLeaveRoom(socket as unknown as Socket)({ id: faker.string.uuid() });

      expect(socket.leave).not.toHaveBeenCalled();
      expect(socket.emit).not.toHaveBeenCalled();
    });
  });
});