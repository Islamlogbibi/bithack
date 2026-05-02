import { DataSource } from 'typeorm';
import {
  UserEntity, StudentEntity, TeacherEntity, GradeEntity, PresenceEntity,
  DepartmentEntity, SpecialityEntity, LevelEntity, SectionEntity, GroupEntity,
  CourseEntity, CVAcademiqueEntity, TeacherSpecialityEntity, TeacherModuleEntity,
  ResourceEntity, JustificationEntity, ValidationEntity, AttendanceAlertEntity,
  MessageEntity, ScheduleEntity, ReferenceBlobEntity, AssignmentEntity, AssignmentSubmissionEntity
} from './entities';
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

async function testQuery() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(StudentEntity);

  const filters = {
    speciality: 'Informatique Académique',
    level: 'L2',
    section: 'B',
    group: 'Group 1'
  };

  const qb = repo.createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.speciality', 'speciality')
      .leftJoinAndSelect('student.level', 'level')
      .leftJoinAndSelect('student.section', 'section')
      .leftJoinAndSelect('student.group', 'group');
    
  qb.andWhere('(LOWER(speciality.libelle) = :specialityName OR LOWER(speciality.name) = :specialityName)', {
    specialityName: filters.speciality.toLowerCase(),
  });
  qb.andWhere('LOWER(level.libelle) = :levelName', { levelName: filters.level.toLowerCase() });
  qb.andWhere('LOWER(section.code) = :sectionCode', { sectionCode: filters.section.toLowerCase() });
  qb.andWhere('LOWER(group.code) = :groupCode', { groupCode: filters.group.toLowerCase() });

  console.log(qb.getSql());
  const students = await qb.getMany();
  console.log('Students found:', students.length);
  for (const s of students) {
    console.log(s.user?.fullName, s.matricule);
  }

  await dataSource.destroy();
}

testQuery().catch(console.error);
