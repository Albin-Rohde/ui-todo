import { Socket } from "socket.io";
import { TodoListService } from "./service";

export const handleJoinRoom = (socket: Socket) => async (data: { id: string }) => {
  const { id } = data;
  const todoListService = new TodoListService();

  try {
    await todoListService.getByPublicId(id)
    socket.join(id);
    socket.emit("joined", id);
  } catch (err: any) {
    if (err?.name === "EntityNotFoundError") {
      console.log(`user: ${socket.request.session.user.id} tried to join room: ${id} but it doesn't exist`);
      return;
    }
    throw err;
  }
}

export const handleLeaveRoom = (socket: Socket) => async (data: { id: string }) => {
  const { id } = data;
  const todoListService = new TodoListService();

  try {
    await todoListService.getByPublicId(id)
    socket.leave(id);
    socket.emit("left", id);
  } catch (err: any) {
    if (err?.name === "EntityNotFoundError") {
      console.log(`user: ${socket.request.session.user.id} tried to leave room: ${id} but it doesn't exist`);
      return;
    }
    throw err;
  }
}

const Listeners = [
  {
    event: "todolist.join-room",
    handler: handleJoinRoom,
  },
  {
    event: "todolist.leave-room",
    handler: handleLeaveRoom,
  }
]

export default Listeners;
