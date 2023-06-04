import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TodoList } from "../../todolist/entity/TodoList";

@Entity("todo_item")
export class TodoItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  text!: string;

  @Column({ default: false })
  completed!: boolean;

  @ManyToOne(type => TodoList, todoList => todoList.items, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "todo_list_id" })
  list!: TodoList

  @Column({ name: "todo_list_id" })
  listId!: number;

  @Column({ name: "parent_item_id", nullable: true, type: "int" })
  parentItemId!: number | null;
}
