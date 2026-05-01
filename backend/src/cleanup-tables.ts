import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function cleanup() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const queryRunner = dataSource.createQueryRunner();
  
  await queryRunner.connect();
  console.log('--- Nettoyage des tables ---');
  await queryRunner.query('DROP TABLE IF EXISTS validations, schedules, attendance_alerts, teacher_modules, grades, absences CASCADE;');
  console.log('--- Tables supprimées ---');
  
  await queryRunner.release();
  await app.close();
}

cleanup().catch(err => {
  console.error(err);
  process.exit(1);
});
