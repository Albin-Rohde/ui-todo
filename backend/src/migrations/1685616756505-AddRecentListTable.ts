import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRecentListTable1685616756505 implements MigrationInterface {
    name = 'AddRecentListTable1685616756505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recent_todo_list"
                                 (
                                     "id"        SERIAL    NOT NULL,
                                     "user_id"   integer   NOT NULL,
                                     "list_id"   integer   NOT NULL,
                                     "viewed_at" TIMESTAMP NOT NULL DEFAULT now(),
                                     CONSTRAINT "UQ_efcf71bac10557c9b15e23f8c00" UNIQUE ("user_id", "list_id"),
                                     CONSTRAINT "PK_501e5da052860133c60b3b5723e" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`ALTER TABLE "recent_todo_list"
            ADD CONSTRAINT "FK_503c0dc446c80e02240f9bf9403" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recent_todo_list"
            ADD CONSTRAINT "FK_18bab2c6d2b6a2814c024dced71" FOREIGN KEY ("list_id") REFERENCES "todo_list" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recent_todo_list"
            DROP CONSTRAINT "FK_18bab2c6d2b6a2814c024dced71"`);
        await queryRunner.query(`ALTER TABLE "recent_todo_list"
            DROP CONSTRAINT "FK_503c0dc446c80e02240f9bf9403"`);
        await queryRunner.query(`DROP TABLE "recent_todo_list"`);
    }

}
