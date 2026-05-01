"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
async function cleanup() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
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
//# sourceMappingURL=cleanup-tables.js.map