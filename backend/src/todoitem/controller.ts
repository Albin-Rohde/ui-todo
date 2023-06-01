import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseBefore
} from "routing-controllers";
import { CurrentUser, HandleErrors } from "../decorators";
import { loginRequired } from "../middlewares";
import { User } from "../user/entity/User";
import { TodoItemService } from "./service";
import { createTodoItemInput, createTodoItemSchema } from "./schema";


@Controller("/todo-list/:listId/todo-item")
export class TodoItemController {
  constructor(
    private readonly todoItemService: TodoItemService = new TodoItemService()
  ) {
  }

  @HandleErrors
  @Post("/")
  @UseBefore(loginRequired)
  async createTodoItem(
    @CurrentUser() user: User,
    @Body() data: createTodoItemInput,
    @Param("listId") listId: string
  ) {
    const { text, completed } = await createTodoItemSchema.validate(data);
    const todoList = await this.todoItemService.create({
      publicListId: listId,
      text,
      completed,
    });
    return {
      ok: true,
      err: null,
      data: this.todoItemService.responseFormat(todoList),
    };
  }

  @HandleErrors
  @Put("/:id")
  @UseBefore(loginRequired)
  async updateTodoItem(
    @CurrentUser() user: User,
    @Param("id") id: number,
    @Param("listId") listId: string,
    @Body() data: createTodoItemInput
  ) {
    const { text, completed } = await createTodoItemSchema.validate(data);
    const todoList = await this.todoItemService.update({
      id,
      publicListId: listId,
      text,
      completed,
    });
    return {
      ok: true,
      err: null,
      data: this.todoItemService.responseFormat(todoList),
    };
  }

  @HandleErrors
  @Delete("/:id")
  @UseBefore(loginRequired)
  async deleteTodoItem(
    @Param("id") id: number,
    @Param("listId") listId: string
  ) {
    await this.todoItemService.delete({
      id,
      publicListId: listId,
    });
    return {
      ok: true,
      err: null,
      data: "ok",
    };
  }

  @HandleErrors
  @Get("/")
  @UseBefore(loginRequired)
  async getAllTodoItemsInList(@CurrentUser() user: User, @Param("listId") listId: string) {
    const items = await this.todoItemService.getByListId(user, listId);
    return {
      ok: true,
      err: null,
      data: items.map(item => this.todoItemService.responseFormat(item)),
    };
  }
}
