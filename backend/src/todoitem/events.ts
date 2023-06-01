import { Socket } from "socket.io";
import { TodoItemService } from "./service";

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
      publicListId: listId,
      id,
      text,
      completed
    })
    socket.broadcast.to(listId).emit("todoitem.item-updated", todoItemService.responseFormat(updatedItem));
  } catch (err: any) {
    if (err?.name === "EntityNotFoundError") {
      console.log(`user: ${socket.request.session.user.id} tried to update item: ${id} but it doesn't exist`);
      return;
    }
    throw err;
  }
}

export const handleCreateTodoItem = (socket: Socket) => async (data: {
  listId: string,
  text: string,
  completed: boolean
}) => {
  const todoItemService = new TodoItemService();
  const { listId, text, completed } = data;

  try {
    const newItem = await todoItemService.create({
      publicListId: listId,
      text,
      completed
    })
    console.log("handling create item event")
    console.log(data)
    socket.broadcast.to(listId).emit("todoitem.item-created", todoItemService.responseFormat(newItem));
  } catch (err: any) {
    if (err?.name === "EntityNotFoundError") {
      console.log(`user: ${socket.request.session.user.id} tried to create item: ${text} but it doesn't exist`);
      return;
    }
    throw err;
  }
}


const listeners = [
  {
    event: "todoitem.update-todo-item",
    handler: handleUpdateTodoItem,
  },
  {
    event: "todoitem.create-todo-item",
    handler: handleCreateTodoItem,
  }
]

export default listeners;