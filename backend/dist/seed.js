"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'bithack',
    entities: [
        entities_1.UserEntity, entities_1.StudentEntity, entities_1.TeacherEntity, entities_1.GradeEntity, entities_1.PresenceEntity,
        entities_1.DepartmentEntity, entities_1.SpecialityEntity, entities_1.LevelEntity, entities_1.SectionEntity, entities_1.GroupEntity,
        entities_1.CourseEntity, entities_1.CVAcademiqueEntity, entities_1.TeacherSpecialityEntity,
        entities_1.ResourceEntity, entities_1.JustificationEntity, entities_1.ValidationEntity, entities_1.AttendanceAlertEntity,
        entities_1.MessageEntity, entities_1.ScheduleEntity, entities_1.ReferenceBlobEntity, entities_1.AssignmentEntity, entities_1.AssignmentSubmissionEntity
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
    const userRepo = dataSource.getRepository(entities_1.UserEntity);
    const studentRepo = dataSource.getRepository(entities_1.StudentEntity);
    const teacherRepo = dataSource.getRepository(entities_1.TeacherEntity);
    const deptRepo = dataSource.getRepository(entities_1.DepartmentEntity);
    const specRepo = dataSource.getRepository(entities_1.SpecialityEntity);
    const levelRepo = dataSource.getRepository(entities_1.LevelEntity);
    const sectionRepo = dataSource.getRepository(entities_1.SectionEntity);
    const groupRepo = dataSource.getRepository(entities_1.GroupEntity);
    const courseRepo = dataSource.getRepository(entities_1.CourseEntity);
    const teacherSpecRepo = dataSource.getRepository(entities_1.TeacherSpecialityEntity);
    const gradeRepo = dataSource.getRepository(entities_1.GradeEntity);
    const scheduleRepo = dataSource.getRepository(entities_1.ScheduleEntity);
    const deptInfo = await deptRepo.save(deptRepo.create({
        libelle: 'Département Informatique',
        code: 'INFO'
    }));
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
    await userRepo.save(userRepo.create({
        email: 'admin@pui.dz',
        passwordHash,
        fullName: 'Prof. Amina Hadj',
        role: 'admin',
        department: 'INFO',
        adminStatsJson: { totalStudents: 1500, activeTeachers: 90 },
    }));
    const teacherNames = ['Dr. Karim Meziani', 'Dr. Mourad Bakri'];
    const teachers = [];
    for (const name of teacherNames) {
        const user = await userRepo.save(userRepo.create({
            email: name.toLowerCase().replace(/dr\.|mme\.|pr\./g, '').trim().replace(/\s+/g, '.') + '@pui.dz',
            passwordHash, fullName: name, role: 'teacher', department: 'INFO'
        }));
        const teacher = await teacherRepo.save(teacherRepo.create({
            user, department: deptInfo, orcid: '0000-0000-0000-0000'
        }));
        teachers.push(teacher);
        await teacherSpecRepo.save(teacherSpecRepo.create({
            teacher, speciality, level: levels[0]
        }));
    }
    const subjects = ['Algorithmique', 'Bases de données', 'IA', 'Réseaux'];
    const courses = [];
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
        for (const course of courses.slice(0, 2)) {
            await gradeRepo.save(gradeRepo.create({
                student, course, teacher: course.teacher, valeur: 10 + (i % 10),
                session: 'Normal', statut: 'Valide'
            }));
        }
    }
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
//# sourceMappingURL=seed.js.map