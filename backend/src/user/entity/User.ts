import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, } from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 255, unique: true })
  username!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
