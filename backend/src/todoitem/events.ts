import { Socket } from "socket.io";
import { TodoItemService } from "./service";
import { TodoListService } from "../todolist/service";

export const handleUpdateTodoItem = (socket: Socket) => async (data: {
  listId: string,
  id: number,
  text: string,
  completed: boolean
}) => {
  const todoItemService = new TodoItemService();
  const { listId, id, text, completed } = data;

  try {
    const updatedItem = await todoItemService.update({
      user: socket.request.session.user,
      publicListId: listId,
      id,
      text,
      completed
    })
    socket.broadcast.to(listId).emit("todoitem.item-updated", todoItemService.responseFormat(updatedItem));
  } catch (err: any) {
    if (err?.name === "EntityNotFoundError") {
      return;
    }
    console.log(err);
  }
}

export const handleNotifyNewItem = (socket: Socket) => async (data: {
  listId: string,
  id: number,
}) => {
  const todoItemService = new TodoItemService();
  const { listId, id } = data;

  try {
    const item = await todoItemService.getById(socket.request.session.user, id);
    socket.broadcast.to(listId).emit("todoitem.item-created", todoItemService.responseFormat(item));
  } catch (err: any) {
    if (err?.name === "EntityNotFoundError") {
      return;
    }
    console.log(err)
  }
}

export const handleUpdateCursorPos = (socket: Socket) => async (data: {
  listId: string,
  itemId: number,
  cursorStart: number | null,
  cursorEnd: number | null
}) => {
  const todoItemService = new TodoItemService();
  const todoListService = new TodoListService();
  const { listId, itemId, cursorStart, cursorEnd } = data;

  try {
    // verify that list exists
    await todoListService.getByPublicId(listId, socket.request.session.user);
    // verify that item exists
    const item = await todoItemService.getById(socket.request.session.user, itemId)
    const cursorPosData = {
      listId,
      itemId: item.id,
      cursorStart,
      cursorEnd,
      userId: socket.request.session.user.id,
      username: socket.request.session.user.username,
    }
    socket.broadcast.to(listId).emit("todoitem.cursor-pos-updated", cursorPosData);
  } catch (err: any) {
    if (err?.name === "EntityNotFoundError") {
      return;
    }
    console.log(err);
  }
}

const listeners = [
  {
    event: "todoitem.update-todo-item",
    handler: handleUpdateTodoItem,
  },
  {
    event: "todoitem.notify-new-todo-item",
    handler: handleNotifyNewItem,
  },
  {
    event: "todoitem.update-cursor-pos",
    handler: handleUpdateCursorPos,
  }
]

export default listeners;