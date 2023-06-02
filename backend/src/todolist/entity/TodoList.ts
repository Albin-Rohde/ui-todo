import {
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "../../user/entity/User";
import { TodoItem } from "../../todoitem/entity/TodoItem";

@Index(["publicId"])
@Entity("todo_list")
export class TodoList {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Generated("uuid")
  @Column({ name: "public_id" })
  publicId!: string;

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

  @Column({ name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ default: false })
  readonly!: boolean;

  @Column({ default: false })
  private!: boolean;
}
