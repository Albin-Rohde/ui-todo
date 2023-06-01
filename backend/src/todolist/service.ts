import { User } from "../user/entity/User";
import { Repository } from "typeorm";
import { db } from "../data-source";
import { TodoList } from "./entity/TodoList";
import { ValidationError } from "yup";
import { RecentList } from "./entity/RecentList";


export class TodoListService {
  constructor(
    private readonly todoListRepository: Repository<TodoList> = db.getRepository(TodoList),
    private readonly recentListRepository: Repository<RecentList> = db.getRepository(RecentList)
  ) {
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

  public async getByPublicId(publicId: string, user?: User) {
    const todoList = await this.todoListRepository.findOneOrFail({
      where: {
        publicId: publicId
      }
    });
    if (user && todoList.userId !== user.id) {
      await this.saveToRecentLists(user, todoList);
    }
    return todoList;
  }

  public async getRecentByUser(user: User) {
    const recentLists = await this.recentListRepository.find({
      where: { userId: user.id },
      relations: ["list"]
    });
    return recentLists.map(recentList => recentList.list);
  }

  public async update(user: User, publicId: string, name: string) {
    const existingList = await this.todoListRepository.exist({
      where: { userId: user.id, name }
    });
    if (existingList) {
      throw new ValidationError("A list with this name already exists");
    }
    const todoList = await this.getByPublicId(publicId, user);
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

  private async saveToRecentLists(user: User, todoList: TodoList) {
    const recentList = await this.recentListRepository.findOne({
      where: { userId: user.id, listId: todoList.id }
    });

    if (recentList) {
      recentList.viewedAt = new Date();
      await this.recentListRepository.save(recentList);
      return;
    }
    const newRecentList = new RecentList();
    newRecentList.user = user;
    newRecentList.list = todoList;
    newRecentList.viewedAt = new Date();
    await this.recentListRepository.save(newRecentList);
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
