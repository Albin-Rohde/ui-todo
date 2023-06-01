import { Body, Controller, Get, Param, Post, Put, UseBefore } from "routing-controllers";
import { CurrentUser, HandleErrors } from "../decorators";
import { loginRequired } from "../middlewares";
import { User } from "../user/entity/User";
import { TodoListService } from "./service";
import { updateTodoListSchema } from "./schema";


@Controller("/todo-list")
export class TodoListController {
  constructor(private readonly todoListServie: TodoListService = new TodoListService()) {
  }

  @HandleErrors
  @Get("/all")
  @UseBefore(loginRequired)
  async getAllTodoLists(@CurrentUser() user: User) {
    const todoListsResponse = (await this.todoListServie.getAllByUser(user))
      .map(this.todoListServie.responseFormat);
    return {
      ok: true,
      err: null,
      data: todoListsResponse,
    }
  }

  @HandleErrors
  @Get("/:id")
  @UseBefore(loginRequired)
  async getTodoList(@Param("id") id: string, @CurrentUser() user: User) {
    const todoListResponse = await this.todoListServie.getByPublicId(id, user)
      .then(this.todoListServie.responseFormat)
    return {
      ok: true,
      err: null,
      data: todoListResponse,
    }
  }

  @HandleErrors
  @Post("/")
  @UseBefore(loginRequired)
  async createTodoList(@CurrentUser() user: User) {
    const todoList = await this.todoListServie.create(user);
    return {
      ok: true,
      err: null,
      data: this.todoListServie.responseFormat(todoList),
    };
  }

  @HandleErrors
  @Put("/:id")
  @UseBefore(loginRequired)
  async updateTodoList(@CurrentUser() user: User, @Param("id") id: string, @Body() body: {
    name: string
  }) {
    const { name } = await updateTodoListSchema.validate(body);
    const todoList = await this.todoListServie.update(user, id, name)
    return {
      ok: true,
      err: null,
      data: this.todoListServie.responseFormat(todoList),
    };
  }
}
