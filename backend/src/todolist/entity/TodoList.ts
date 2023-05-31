import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "../../user/entity/User";
import { TodoItem } from "../../todoitem/entity/TodoItem";

@Entity("todo_list")
export class TodoList {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Generated("uuid")
  @Column()
  public_id!: string;

  @ManyToOne(type => User, user => user.todoLists, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "user_id" })
  user!: User

  @Column({ name: "user_id" })
  userId!: number;

  @OneToMany(() => TodoItem, todoItem => todoItem.list)
  items!: TodoItem[];
}
