import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TodoList } from "../../todolist/entity/TodoList";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 255, unique: true })
  username!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => TodoList, todoList => todoList.user)
  todoLists!: TodoList[];
}
