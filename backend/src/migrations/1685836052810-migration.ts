import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1685836052810 implements MigrationInterface {
    name = 'Migration1685836052810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo_item"
            ADD "parent_item_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo_item"
            DROP COLUMN "parent_item_id"`);
    }

}
