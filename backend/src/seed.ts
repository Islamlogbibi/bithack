import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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
} from './entities';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('Database connected via NestJS!');

  // Clear tables in order of dependencies
  await dataSource.dropDatabase();
  await dataSource.synchronize();
  console.log('Database cleared and synchronized.');

  const passwordHash = await bcrypt.hash('password123', 10);

  const userRepo = dataSource.getRepository(UserEntity);
  const studentRepo = dataSource.getRepository(StudentEntity);
  const teacherRepo = dataSource.getRepository(TeacherEntity);
  const scheduleRepo = dataSource.getRepository(ScheduleEntity);
  const resourceRepo = dataSource.getRepository(ResourceEntity);
  const justificationRepo = dataSource.getRepository(JustificationEntity);
  const validationRepo = dataSource.getRepository(ValidationEntity);
  const alertRepo = dataSource.getRepository(AttendanceAlertEntity);
  const specialityRepo = dataSource.getRepository(SpecialityEntity);

  // 1. Create Admins
  await userRepo.save(userRepo.create({
    email: 'admin@pui.dz',
    passwordHash,
    fullName: 'Prof. Amina Hadj',
    role: 'admin',
    department: 'Département Informatique',
    adminStatsJson: {
      totalStudents: 1500, activeTeachers: 90, pendingValidations: 15, avgAttendance: 88, publishedResources: 450,
    },
  }));

  // 2. Create Dean
  await userRepo.save(userRepo.create({
    email: 'dean@pui.dz', passwordHash, fullName: 'Pr. Samia Belkacem', role: 'dean', faculty: 'Faculté des Nouvelles Technologies',
  }));

  // 3. Create Teachers
  const teacherNames = ['Dr. Karim Meziani', 'Dr. Mourad Bakri'];
  const teachers: TeacherEntity[] = [];
  const subjectsPool = ['Algorithmique', 'Bases de données', 'Réseaux', 'IA'];

  for (const name of teacherNames) {
    const email = name.toLowerCase()
      .replace(/dr\.|mme\.|pr\./g, '')
      .trim()
      .replace(/\s+/g, '.') + '@pui.dz';
    const user = await userRepo.save(userRepo.create({
      email, passwordHash, fullName: name, role: 'teacher', department: 'Informatique',
    }));
    const teacher = await teacherRepo.save(teacherRepo.create({
      user,
      department: 'Informatique',
      hoursPlanned: 160,
      hoursCompleted: 45,
      subjectsJson: subjectsPool,
      groupsJson: ['Group A', 'Group B'],
      academicCvJson: {
        orcid: '0000-0002-1825-0097',
        scopus: '57193563400',
        publications: [
          { title: 'Advanced Algorithms in Distributed Systems', year: 2023, journal: 'IEEE Transactions' },
          { title: 'Machine Learning for Educational Data Mining', year: 2022, journal: 'Journal of AI Research' },
        ]
      }
    }));
    teachers.push(teacher);
  }

  // 4. Create Students (60 total for Group A/B testing)
  console.log('Generating 60 students for Group A/B testing...');
  const allStudents: StudentEntity[] = [];
  
  for (let i = 1; i <= 60; i++) {
    const groupName = i <= 30 ? 'Group A' : 'Group B';
    const studentUser = await userRepo.save(userRepo.create({
      email: `student${i}@pui.dz`,
      passwordHash,
      fullName: `Etudiant ${i}`,
      role: 'student',
    }));

    const student = await studentRepo.save(studentRepo.create({
      user: studentUser,
      matricule: `2024${String(i).padStart(4, '0')}`,
      speciality: 'Informatique',
      level: 'L3',
      section: 'A',
      groupName: groupName,
      average: 12.5,
      absences: 2,
      yearLabel: 'L3 Informatique',
      displayFaculty: 'Nouvelles Technologies',
      displayDepartment: 'Informatique',
      gradesJson: [
        { subject: 'Algorithmique', td: 14, exam: null, final: null, status: 'En attente', credits: 6 },
        { subject: 'Bases de données', td: 12, exam: null, final: null, status: 'En attente', credits: 4 },
      ],
      absencesByModuleJson: { 'Algorithmique': 1, 'Bases de données': 1 },
      gpaByPeriodJson: [{ year: '2023', semester: 'S1', gpa: 12.5 }],
    }));
    allStudents.push(student);
  }

  // 5. Create Timetables for Group A and B
  console.log('Generating timetables...');
  
  // Group A Timetable
  const groupASessions = [
    { day: 'Dimanche', time: '08:30', subject: 'Algorithmique', room: 'Amphi A', type: 'Cours', scope: 'group', scopeId: 'Group A' },
    { day: 'Lundi', time: '10:30', subject: 'Bases de données', room: 'Salle B1', type: 'TD', scope: 'group', scopeId: 'Group A' },
    { day: 'Mardi', time: '14:00', subject: 'Réseaux', room: 'Labo 1', type: 'TP', scope: 'group', scopeId: 'Group A' },
  ];
  for (const s of groupASessions) {
    await scheduleRepo.save(scheduleRepo.create(s as any));
  }

  // Group B Timetable
  const groupBSessions = [
    { day: 'Dimanche', time: '10:30', subject: 'Algorithmique', room: 'Amphi B', type: 'Cours', scope: 'group', scopeId: 'Group B' },
    { day: 'Lundi', time: '08:30', subject: 'Bases de données', room: 'Salle B2', type: 'TD', scope: 'group', scopeId: 'Group B' },
    { day: 'Mercredi', time: '14:00', subject: 'Réseaux', room: 'Labo 2', type: 'TP', scope: 'group', scopeId: 'Group B' },
  ];
  for (const s of groupBSessions) {
    await scheduleRepo.save(scheduleRepo.create(s as any));
  }

  // 6. Create Specialities records
  await specialityRepo.save([
    { name: 'Informatique', level: 'L3', section: 'A', groupName: 'Group A' },
    { name: 'Informatique', level: 'L3', section: 'A', groupName: 'Group B' },
  ]);

  console.log('Seeding completed successfully!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
