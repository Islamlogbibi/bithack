import { DataSource } from 'typeorm';
import {
  UserEntity,
  StudentEntity,
  TeacherEntity,
  ScheduleEntity,
  ResourceEntity,
  JustificationEntity,
  ValidationEntity,
  AttendanceAlertEntity,
  MessageEntity,
  SpecialityEntity,
  GradeEntity,
  PresenceEntity,
  DepartmentEntity,
  LevelEntity,
  SectionEntity,
  GroupEntity,
  CourseEntity,
  CVAcademiqueEntity,
  TeacherSpecialityEntity,
  TeacherModuleEntity,
  ReferenceBlobEntity,
  AssignmentEntity,
  AssignmentSubmissionEntity
} from './entities';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'bithack',
  entities: [
    UserEntity, StudentEntity, TeacherEntity, GradeEntity, PresenceEntity,
    DepartmentEntity, SpecialityEntity, LevelEntity, SectionEntity, GroupEntity,
    CourseEntity, CVAcademiqueEntity, TeacherSpecialityEntity, TeacherModuleEntity,
    ResourceEntity, JustificationEntity, ValidationEntity, AttendanceAlertEntity,
    MessageEntity, ScheduleEntity, ReferenceBlobEntity, AssignmentEntity, AssignmentSubmissionEntity
  ],
  synchronize: false,
});

async function bootstrap() {
  await dataSource.initialize();
  console.log('Database connected!');

  await dataSource.dropDatabase();
  console.log('Database dropped.');

  await dataSource.synchronize(true);
  console.log('Database synchronized with new schema.');

  const passwordHash = await bcrypt.hash('password123', 10);

  const userRepo = dataSource.getRepository(UserEntity);
  const studentRepo = dataSource.getRepository(StudentEntity);
  const teacherRepo = dataSource.getRepository(TeacherEntity);
  const deptRepo = dataSource.getRepository(DepartmentEntity);
  const specRepo = dataSource.getRepository(SpecialityEntity);
  const levelRepo = dataSource.getRepository(LevelEntity);
  const sectionRepo = dataSource.getRepository(SectionEntity);
  const groupRepo = dataSource.getRepository(GroupEntity);
  const courseRepo = dataSource.getRepository(CourseEntity);
  const teacherSpecRepo = dataSource.getRepository(TeacherSpecialityEntity);
  const teacherModuleRepo = dataSource.getRepository(TeacherModuleEntity);
  const gradeRepo = dataSource.getRepository(GradeEntity);
  const scheduleRepo = dataSource.getRepository(ScheduleEntity);

  // 1. Create Department
  const deptInfo = await deptRepo.save(deptRepo.create({
    libelle: 'Département Informatique',
    code: 'INFO'
  }));

  // 2. Create Hierarchy
  const speciality = await specRepo.save(specRepo.create({
    libelle: 'Informatique Académique',
    code: 'INFO_ACAD',
    department: deptInfo
  }));

  const levels = [];
  for (const l of ['L3', 'M1']) {
    levels.push(await levelRepo.save(levelRepo.create({
      libelle: l,
      code: l,
      speciality
    })));
  }

  const sections = [];
  for (const level of levels) {
    sections.push(await sectionRepo.save(sectionRepo.create({
      code: 'A',
      level
    })));
  }

  const groups = [];
  for (const section of sections) {
    groups.push(await groupRepo.save(groupRepo.create({
      code: 'Group 1',
      type: 'TD',
      section
    })));
    groups.push(await groupRepo.save(groupRepo.create({
      code: 'Group 2',
      type: 'TP',
      section
    })));
  }

  // 2-bis. Dedicated hierarchy for a common test case: Informatique L2 / Section B / Group 1
  const l2Level = await levelRepo.save(levelRepo.create({
    libelle: 'L2',
    code: 'L2',
    speciality
  }));
  const l2SectionB = await sectionRepo.save(sectionRepo.create({
    code: 'B',
    level: l2Level
  }));
  const l2SectionBGroup1 = await groupRepo.save(groupRepo.create({
    code: 'Group 1',
    type: 'TD',
    section: l2SectionB
  }));

  // 3. Create Admins
  await userRepo.save(userRepo.create({
    email: 'admin@pui.dz',
    passwordHash,
    fullName: 'Prof. Amina Hadj',
    role: 'admin',
    department: 'INFO',
    adminStatsJson: { totalStudents: 1500, activeTeachers: 90 },
  }));

  // 4. Create Teachers
  const teacherNames = ['Dr. Karim Meziani', 'Dr. Mourad Bakri'];
  const teachers: TeacherEntity[] = [];
  for (const name of teacherNames) {
    const user = await userRepo.save(userRepo.create({
      email: name.toLowerCase().replace(/dr\.|mme\.|pr\./g, '').trim().replace(/\s+/g, '.') + '@pui.dz',
      passwordHash, fullName: name, role: 'teacher', department: 'INFO'
    }));
    const teacher = await teacherRepo.save(teacherRepo.create({
      user, department: deptInfo, orcid: '0000-0000-0000-0000'
    }));
    teachers.push(teacher);

    // Assign to Speciality/Level
    await teacherSpecRepo.save(teacherSpecRepo.create({
      teacher, speciality, level: levels[0]
    }));
  }

  // 4-bis. Create teacher module/group assignments used by teacher dashboards
  for (const teacher of teachers) {
    for (const subject of ['Algorithmique', 'Bases de données']) {
      for (const groupName of ['L3 Info G1', 'L3 Info G2']) {
        await teacherModuleRepo.save(teacherModuleRepo.create({
          teacher,
          subject,
          groupName
        }));
      }
    }
  }

  // 5. Create Courses
  const subjects = ['Algorithmique', 'Bases de données', 'IA', 'Réseaux'];
  const courses: CourseEntity[] = [];
  for (let i = 0; i < subjects.length; i++) {
    courses.push(await courseRepo.save(courseRepo.create({
      intitule: subjects[i],
      codeCours: `INF${100 + i}`,
      credits: 4,
      type: 'Cours',
      teacher: teachers[i % 2],
      speciality,
      level: levels[0]
    })));
  }

  const createMockGradesForStudent = async (student: StudentEntity, studentIndex: number) => {
    // Mock 4 modules with TD + TP-style marks (TP stored in examGrade for current UI).
    for (const [index, course] of courses.slice(0, 4).entries()) {
      const tdGrade = 9 + ((studentIndex + index) % 8);
      const tpGrade = 10 + ((studentIndex + index * 2) % 8);
      const finalGrade = Math.round((((tdGrade + tpGrade) / 2) * 10)) / 10;

      await gradeRepo.save(gradeRepo.create({
        student,
        course,
        teacher: course.teacher,
        subject: course.intitule,
        tdGrade,
        examGrade: tpGrade,
        finalGrade,
        valeur: finalGrade,
        session: 'Normal',
        statut: 'Valide',
        status: 'approved',
        credits: course.credits,
      }));
    }
  };

  // 6. Create Students
  console.log('Generating students in the new hierarchy...');
  for (let i = 1; i <= 60; i++) {
    const group = i <= 30 ? groups[0] : groups[1];
    const user = await userRepo.save(userRepo.create({
      email: `student${i}@pui.dz`, passwordHash, fullName: `Etudiant ${i}`, role: 'student'
    }));
    const student = await studentRepo.save(studentRepo.create({
      user, matricule: `2024${String(i).padStart(4, '0')}`,
      speciality, level: levels[0], section: sections[0], group
    }));

    await createMockGradesForStudent(student, i);
  }

  // 6-bis. Create a deterministic test student account for L2/B/Group 1
  const l2TestUser = await userRepo.save(userRepo.create({
    email: 'student.l2b1@pui.dz',
    passwordHash,
    fullName: 'Etudiant Test L2 B1',
    role: 'student'
  }));
  const l2TestStudent = await studentRepo.save(studentRepo.create({
    user: l2TestUser,
    matricule: '2024L2B1001',
    speciality,
    level: l2Level,
    section: l2SectionB,
    group: l2SectionBGroup1
  }));
  await createMockGradesForStudent(l2TestStudent, 61);

  // 7. Create Schedules
  console.log('Generating schedules...');
  const today = new Date();
  await scheduleRepo.save(scheduleRepo.create({
    dateSeance: today, heureDebut: '08:30:00', heureFin: '10:00:00',
    salle: 'Amphi A', course: courses[0], speciality, level: levels[0],
    section: sections[0], group: groups[0]
  }));

  console.log('Seeding completed successfully with new hierarchy!');
  await dataSource.destroy();
}

bootstrap().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
