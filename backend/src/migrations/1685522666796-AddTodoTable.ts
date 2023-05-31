import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTodoTable1685522666796 implements MigrationInterface {
    name = 'AddTodoTable1685522666796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo_list"
                                 (
                                     "id"        SERIAL                 NOT NULL,
                                     "name"      character varying(255) NOT NULL,
                                     "public_id" uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                                     "user_id"   integer                NOT NULL,
                                     CONSTRAINT "PK_1a5448d48035763b9dbab86555b" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`ALTER TABLE "todo_list"
            ADD CONSTRAINT "FK_875f735cfedb1c34d69670b2869" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo_list"
            DROP CONSTRAINT "FK_875f735cfedb1c34d69670b2869"`);
        await queryRunner.query(`DROP TABLE "todo_list"`);
    }

}
