"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
async function migrate() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    console.log('--- Démarrage de la migration ---');
    const students = await dataSource.getRepository(entities_1.StudentEntity).find();
    for (const student of students) {
        if (student.gradesJson && Array.isArray(student.gradesJson)) {
            for (const g of student.gradesJson) {
                const grade = new entities_1.GradeEntity();
                grade.student = student;
                grade.subject = g.subject || 'Inconnu';
                grade.tdGrade = g.td ?? 10;
                grade.examGrade = g.exam ?? 10;
                grade.finalGrade = g.final ?? (grade.tdGrade * 0.4 + grade.examGrade * 0.6);
                grade.credits = g.credits ?? 3;
                grade.status = g.status === 'Validé' ? 'approved' : 'pending';
                grade.semester = 'S1';
                await dataSource.getRepository(entities_1.GradeEntity).save(grade);
            }
            console.log(`Notes migrées pour l'étudiant: ${student.matricule}`);
        }
    }
    const teachers = await dataSource.getRepository(entities_1.TeacherEntity).find({ relations: ['user'] });
    for (const teacher of teachers) {
        if (teacher.subjectsJson && teacher.groupsJson) {
            for (const subject of teacher.subjectsJson) {
                for (const group of teacher.groupsJson) {
                    const tm = new entities_1.TeacherModuleEntity();
                    tm.teacher = teacher;
                    tm.subject = subject;
                    tm.groupName = group;
                    try {
                        await dataSource.getRepository(entities_1.TeacherModuleEntity).save(tm);
                    }
                    catch (e) {
                    }
                }
            }
            console.log(`Modules migrés pour l'enseignant: ${teacher.user.fullName}`);
        }
    }
    const validations = await dataSource.getRepository(entities_1.ValidationEntity).find({ relations: ['teacher'] });
    for (const v of validations) {
        if (v.studentGradesJson && Array.isArray(v.studentGradesJson)) {
            for (const entry of v.studentGradesJson) {
                const student = await dataSource.getRepository(entities_1.StudentEntity).findOne({ where: { matricule: entry.matricule } });
                if (student) {
                    const grade = new entities_1.GradeEntity();
                    grade.student = student;
                    grade.validation = v;
                    grade.subject = v.subject;
                    grade.tdGrade = entry.td ?? 10;
                    grade.examGrade = entry.grade ?? 10;
                    grade.finalGrade = (grade.tdGrade * 0.4 + grade.examGrade * 0.6);
                    grade.status = v.status;
                    await dataSource.getRepository(entities_1.GradeEntity).save(grade);
                }
            }
            console.log(`Détails de validation migrés pour: ${v.subject} (${v.groupName})`);
        }
    }
    const oldSchedules = await dataSource.getRepository(entities_1.ScheduleEntity).find();
    console.log('--- Migration terminée avec succès ---');
    await app.close();
}
migrate().catch(err => {
    console.error('Erreur durant la migration:', err);
    process.exit(1);
});
//# sourceMappingURL=migrate-json-to-sql.js.map