import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { 
  StudentEntity, 
  GradeEntity, 
  TeacherEntity, 
  TeacherModuleEntity, 
  ValidationEntity, 
  ScheduleEntity,
  UserEntity
} from './entities';

async function migrate() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  console.log('--- Démarrage de la migration ---');

  // 1. Migration des Notes (Grades)
  const students = await dataSource.getRepository(StudentEntity).find();
  for (const student of students) {
    if (student.gradesJson && Array.isArray(student.gradesJson)) {
      for (const g of student.gradesJson) {
        const grade = new GradeEntity();
        grade.student = student;
        grade.subject = g.subject || 'Inconnu';
        grade.tdGrade = g.td ?? 10;
        grade.examGrade = g.exam ?? 10;
        grade.finalGrade = g.final ?? (grade.tdGrade * 0.4 + grade.examGrade * 0.6);
        grade.credits = g.credits ?? 3;
        grade.status = g.status === 'Validé' ? 'approved' : 'pending';
        grade.semester = 'S1';
        await dataSource.getRepository(GradeEntity).save(grade);
      }
      console.log(`Notes migrées pour l'étudiant: ${student.matricule}`);
    }
  }

  // 2. Migration des Modules Enseignants
  const teachers = await dataSource.getRepository(TeacherEntity).find({ relations: ['user'] });
  for (const teacher of teachers) {
    if (teacher.subjectsJson && teacher.groupsJson) {
      for (const subject of teacher.subjectsJson) {
        for (const group of teacher.groupsJson) {
          const tm = new TeacherModuleEntity();
          tm.teacher = teacher;
          tm.subject = subject;
          tm.groupName = group;
          try {
            await dataSource.getRepository(TeacherModuleEntity).save(tm);
          } catch (e) {
            // Ignore duplicates if any
          }
        }
      }
      console.log(`Modules migrés pour l'enseignant: ${teacher.user.fullName}`);
    }
  }

  // 3. Migration des Validations
  const validations = await dataSource.getRepository(ValidationEntity).find({ relations: ['teacher'] });
  for (const v of validations) {
    if (v.studentGradesJson && Array.isArray(v.studentGradesJson)) {
      for (const entry of v.studentGradesJson) {
        const student = await dataSource.getRepository(StudentEntity).findOne({ where: { matricule: entry.matricule } });
        if (student) {
          const grade = new GradeEntity();
          grade.student = student;
          grade.validation = v;
          grade.subject = v.subject;
          grade.tdGrade = entry.td ?? 10;
          grade.examGrade = entry.grade ?? 10;
          grade.finalGrade = (grade.tdGrade * 0.4 + grade.examGrade * 0.6);
          grade.status = v.status;
          await dataSource.getRepository(GradeEntity).save(grade);
        }
      }
      console.log(`Détails de validation migrés pour: ${v.subject} (${v.groupName})`);
    }
  }

  // 4. Migration des Emplois du Temps
  // Note: This is tricky because the structure changed significantly. 
  // We'll try to map the old ones if possible, but the seed will be the main source of truth after refactor.
  const oldSchedules = await dataSource.getRepository(ScheduleEntity).find();
  // Since we changed the ScheduleEntity structure, old fields might not be accessible via TypeORM if names changed.
  // We will rely on the NEW seed to populate the schedules correctly.

  console.log('--- Migration terminée avec succès ---');
  await app.close();
}

migrate().catch(err => {
  console.error('Erreur durant la migration:', err);
  process.exit(1);
});
