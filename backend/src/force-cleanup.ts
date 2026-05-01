import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'bithack',
});

async function forceCleanup() {
  await dataSource.initialize();
  console.log('--- Connexion réussie ---');
  await dataSource.query('DROP TABLE IF EXISTS validations, schedules, attendance_alerts, teacher_modules, grades, absences CASCADE;');
  console.log('--- Nettoyage forcé terminé ---');
  await dataSource.destroy();
}

forceCleanup().catch(console.error);
