import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserTable1685139437466 implements MigrationInterface {
    name = 'AddUserTable1685139437466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user"
                                 (
                                     "id"        SERIAL                 NOT NULL,
                                     "email"     character varying(255) NOT NULL,
                                     "password"  character varying(255) NOT NULL,
                                     "username"  character varying(255) NOT NULL,
                                     "createdAt" TIMESTAMP              NOT NULL DEFAULT now(),
                                     CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                                     CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                                     CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                                 )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
