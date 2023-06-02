import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1685698931722 implements MigrationInterface {
    name = 'Migration1685698931722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo_list"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "todo_list"
            ADD "readonly" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "todo_list"
            ADD "private" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE INDEX "IDX_0ce2370b2296a9db9276467087" ON "todo_list" ("public_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0ce2370b2296a9db9276467087"`);
        await queryRunner.query(`ALTER TABLE "todo_list"
            DROP COLUMN "private"`);
        await queryRunner.query(`ALTER TABLE "todo_list"
            DROP COLUMN "readonly"`);
        await queryRunner.query(`ALTER TABLE "todo_list"
            DROP COLUMN "created_at"`);
    }

}
