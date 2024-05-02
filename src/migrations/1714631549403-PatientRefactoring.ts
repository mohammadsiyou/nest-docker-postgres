import { MigrationInterface, QueryRunner } from 'typeorm';

export class PatientRefactoring1714631549403 implements MigrationInterface {
	name = 'PatientRefactoring1714631549403';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "patient" ADD "password" character varying NOT NULL`);
		await queryRunner.query(`ALTER TABLE "patient" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
		await queryRunner.query(`ALTER TABLE "patient" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "updatedAt"`);
		await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "createdAt"`);
		await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "password"`);
	}
}
