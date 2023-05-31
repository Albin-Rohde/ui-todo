import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTodoItemTable1685604745524 implements MigrationInterface {
    name = 'AddTodoItemTable1685604745524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo_item"
                                 (
                                     "id"           SERIAL                 NOT NULL,
                                     "text"         character varying(255) NOT NULL,
                                     "completed"    boolean                NOT NULL DEFAULT false,
                                     "todo_list_id" integer                NOT NULL,
                                     CONSTRAINT "PK_d454c4b9eac15cc27c2ed8e4138" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`ALTER TABLE "todo_item"
            ADD CONSTRAINT "FK_2f9f2b3e4be9581e7b2f343fcbe" FOREIGN KEY ("todo_list_id") REFERENCES "todo_list" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo_item"
            DROP CONSTRAINT "FK_2f9f2b3e4be9581e7b2f343fcbe"`);
        await queryRunner.query(`DROP TABLE "todo_item"`);
    }

}
