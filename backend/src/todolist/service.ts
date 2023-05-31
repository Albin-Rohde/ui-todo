import { User } from "../user/entity/User";
import { Repository } from "typeorm";
import { db } from "../data-source";
import { TodoList } from "./entity/TodoList";
import { ValidationError } from "yup";


export class TodoListService {
  constructor(private readonly todoListRepository: Repository<TodoList> = db.getRepository(TodoList)) {
  }

  public async create(user: User) {
    const todoList = new TodoList();
    todoList.name = await this.getUniqueName(user);
    todoList.user = user;
    return this.todoListRepository.save(todoList);
  }

  public async getAllByUser(user: User) {
    return this.todoListRepository.find({ where: { userId: user.id } });
  }

  public async getByPublicId(user: User, publicId: string) {
    return this.todoListRepository.findOneOrFail({
      where: {
        userId: user.id,
        publicId: publicId
      }
    });
  }

  public async update(user: User, publicId: string, name: string) {
    const todoList = await this.getByPublicId(user, publicId);
    const existingList = await this.todoListRepository.findOne({
      where: { userId: user.id, name }
    });
    if (existingList) {
      throw new ValidationError("A list with this name already exists");
    }
    todoList.name = name;
    return this.todoListRepository.save(todoList);
  }

  public responseFormat(todoList: TodoList) {
    return {
      id: todoList.id,
      publicId: todoList.publicId,
      name: todoList.name,
    }
  }

  private async getUniqueName(user: User) {
    const usersTodolists = await this.todoListRepository.createQueryBuilder("todoList")
      .where("todoList.user_id = :userId", { userId: user.id })
      .getMany();
    const existingNames = usersTodolists.map(todoList => todoList.name);
    let uniqueName = "untitled";
    let i = 1;
    while (existingNames.includes(uniqueName)) {
      uniqueName = `untitled (${i})`;
      i++;
    }
    return uniqueName;
  }
}
