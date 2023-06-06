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
  parentId?: TodoItem["parentItemId"];
}

type UpdateTodoItemInput = {
  user: User;
  id: TodoItem["id"];
  publicListId: TodoList["publicId"];
  text?: TodoItem["text"];
  completed?: TodoItem["completed"];
  parentId?: TodoItem["parentItemId"];
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
    if (list.readonly && input.user.id !== list.userId) {
      throw new Error("List is readonly");
    }
    const item = new TodoItem();
    item.text = input.text;
    item.completed = input.completed || false;
    item.list = list;
    if (input.parentId) {
      const parentExist = await this.todoItemRepository.exist({
        where: {
          id: input.parentId,
          listId: list.id
        }
      });
      if (!parentExist) {
        throw new EntityNotFoundError(TodoItem, "Parent item not found");
      }
      item.parentItemId = input.parentId;
    }
    return this.todoItemRepository.save(item);
  }

  public async update(input: UpdateTodoItemInput) {
    const list = await this.todoListService.getByPublicId(input.publicListId, input.user)
    if (list.readonly && input.user.id !== list.userId) {
      throw new Error("List is readonly");
    }
    const item = await this.todoItemRepository.findOneOrFail({ where: { id: input.id } });
    if (input.text !== undefined) {
      item.text = input.text;
    }
    if (input.completed !== undefined) {
      item.completed = input.completed;
      // Update the complete status of all sub items
      const subItems = await this.recursiveGetChildren(item);
      await Promise.all(subItems.map(async (subItem) => {
        subItem.completed = input.completed!;
        return await this.todoItemRepository.save(subItem);
      }));
    }
    if (input.parentId) {
      const parentExist = await this.todoItemRepository.exist({
        where: {
          id: input.parentId,
          listId: list.id
        }
      });
      if (!parentExist) {
        throw new EntityNotFoundError(TodoItem, "Parent item not found");
      }
      item.parentItemId = input.parentId;
    }
    return this.todoItemRepository.save(item);
  }

  public async delete(input: DeleteTodoItemInput) {
    const { id, publicListId } = input;
    const list = await this.todoListService.getByPublicId(publicListId, input.user)
    if (list.readonly && input.user.id !== list.userId) {
      throw new Error("List is readonly");
    }
    const item = await this.todoItemRepository.findOneOrFail({
      where: {
        id,
        listId: list.id
      }
    });
    const children = await this.recursiveGetChildren(item);
    await this.todoItemRepository.remove(children);
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

  private async recursiveGetChildren(item: TodoItem): Promise<TodoItem[]> {
    // TODO: this is not very efficient since we'll do a roundtrip to the database for each level of children
    const children = await this.todoItemRepository.find({
      where: {
        parentItemId: item.id
      }
    });
    const childrenWithChildren = await Promise.all(children.map(async child => {
      const children = await this.recursiveGetChildren(child);
      return [child, ...children];
    }));
    return childrenWithChildren.flat();
  }

  public responseFormat(todoItem: TodoItem) {
    return {
      id: todoItem.id,
      text: todoItem.text,
      completed: todoItem.completed,
      listId: todoItem.listId,
      parentItemId: todoItem.parentItemId,
    };
  }
}
