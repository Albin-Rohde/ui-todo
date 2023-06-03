import { User } from "../user/entity/User";
import { EntityNotFoundError, Repository } from "typeorm";
import { db } from "../data-source";
import { TodoItem } from "./entity/TodoItem";
import { TodoList } from "../todolist/entity/TodoList";
import { TodoListService } from "../todolist/service";

type CreateTodoItemInput = {
  user: User;
  publicListId: TodoList["publicId"];
  text: TodoItem["text"];
  completed?: TodoItem["completed"];
}

type UpdateTodoItemInput = {
  user: User;
  id: TodoItem["id"];
  publicListId: TodoList["publicId"];
  text?: TodoItem["text"];
  completed?: TodoItem["completed"];
}

type DeleteTodoItemInput = {
  user: User;
  id: TodoItem["id"];
  publicListId: TodoList["publicId"];
}

export class TodoItemService {
  constructor(
    private readonly todoItemRepository: Repository<TodoItem> = db.getRepository(TodoItem),
    private readonly todoListService: TodoListService = new TodoListService(),
  ) {
  }

  public async create(input: CreateTodoItemInput) {
    const list = await this.todoListService.getByPublicId(input.publicListId, input.user)
    if (!list) {
      throw new EntityNotFoundError(TodoList, "TodoList not found");
    }
    const item = new TodoItem();
    item.text = input.text;
    item.completed = input.completed || false;
    item.list = list;
    return this.todoItemRepository.save(item);
  }

  public async update(input: UpdateTodoItemInput) {
    const list = await this.todoListService.getByPublicId(input.publicListId, input.user)
    if (!list) {
      throw new EntityNotFoundError(TodoList, "TodoList not found");
    }
    const item = await this.todoItemRepository.findOneOrFail({ where: { id: input.id } });
    if (input.text !== undefined) {
      item.text = input.text;
    }
    if (input.completed !== undefined) {
      item.completed = input.completed;
    }
    return this.todoItemRepository.save(item);
  }

  public async delete(input: DeleteTodoItemInput) {
    const { id, publicListId } = input;
    const list = await this.todoListService.getByPublicId(publicListId, input.user)
    const item = await this.todoItemRepository.findOneOrFail({
      where: {
        id,
        listId: list.id
      }
    });
    return this.todoItemRepository.remove(item);
  }

  public async getByListId(user: User, listId: string) {
    const list = await this.todoListService.getByPublicId(listId, user)
    if (!list) {
      throw new EntityNotFoundError(TodoList, "TodoList not found");
    }
    return this.todoItemRepository.find({ where: { listId: list.id }, order: { id: "ASC" } });
  }

  // TODO: This should also check that the user has access to the list that the item is in
  public async getById(user: User, id: number) {
    return await this.todoItemRepository.findOneOrFail({ where: { id } });
  }

  public responseFormat(todoItem: TodoItem) {
    return {
      id: todoItem.id,
      text: todoItem.text,
      completed: todoItem.completed,
      listId: todoItem.listId,
    };
  }
}
