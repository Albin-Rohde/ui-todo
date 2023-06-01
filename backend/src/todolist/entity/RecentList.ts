import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { TodoList } from "./TodoList";
import { User } from "../../user/entity/User";

@Unique(["userId", "listId"])
@Entity("recent_todo_list")
export class RecentList {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.recentLists)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "user_id" })
  userId!: number;

  @ManyToOne(() => TodoList)
  @JoinColumn({ name: "list_id" })
  list!: TodoList;

  @Column({ name: "list_id" })
  listId!: number;

  @Column({ name: "viewed_at", default: () => "CURRENT_TIMESTAMP" })
  viewedAt!: Date;
}
