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
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
const bcrypt = __importStar(require("bcrypt"));
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    console.log('Database connected via NestJS!');
    await dataSource.dropDatabase();
    await dataSource.synchronize();
    console.log('Database cleared and synchronized.');
    const passwordHash = await bcrypt.hash('password123', 10);
    const userRepo = dataSource.getRepository(entities_1.UserEntity);
    const studentRepo = dataSource.getRepository(entities_1.StudentEntity);
    const teacherRepo = dataSource.getRepository(entities_1.TeacherEntity);
    const scheduleRepo = dataSource.getRepository(entities_1.ScheduleEntity);
    const resourceRepo = dataSource.getRepository(entities_1.ResourceEntity);
    const justificationRepo = dataSource.getRepository(entities_1.JustificationEntity);
    const validationRepo = dataSource.getRepository(entities_1.ValidationEntity);
    const alertRepo = dataSource.getRepository(entities_1.AttendanceAlertEntity);
    const specialityRepo = dataSource.getRepository(entities_1.SpecialityEntity);
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
    await userRepo.save(userRepo.create({
        email: 'dean@pui.dz', passwordHash, fullName: 'Pr. Samia Belkacem', role: 'dean', faculty: 'Faculté des Nouvelles Technologies',
    }));
    const teacherNames = ['Dr. Karim Meziani', 'Dr. Mourad Bakri'];
    const teachers = [];
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
        }));
        teachers.push(teacher);
    }
    console.log('Generating 60 students...');
    const allStudents = [];
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
    console.log('Generating timetables...');
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
    const groupASessions = [
        { day: 'Dimanche', time: '08:30', subject: 'Algorithmique', room: 'Amphi A', type: 'Cours', scope: 'group', scopeId: 'Group A' },
        { day: 'Lundi', time: '10:30', subject: 'Bases de données', room: 'Salle B1', type: 'TD', scope: 'group', scopeId: 'Group A' },
        { day: 'Mardi', time: '14:00', subject: 'Réseaux', room: 'Labo 1', type: 'TP', scope: 'group', scopeId: 'Group A' },
    ];
    for (const s of groupASessions) {
        await scheduleRepo.save(scheduleRepo.create(s));
    }
    const groupBSessions = [
        { day: 'Dimanche', time: '10:30', subject: 'Algorithmique', room: 'Amphi B', type: 'Cours', scope: 'group', scopeId: 'Group B' },
        { day: 'Lundi', time: '08:30', subject: 'Bases de données', room: 'Salle B2', type: 'TD', scope: 'group', scopeId: 'Group B' },
        { day: 'Mercredi', time: '14:00', subject: 'Réseaux', room: 'Labo 2', type: 'TP', scope: 'group', scopeId: 'Group B' },
    ];
    for (const s of groupBSessions) {
        await scheduleRepo.save(scheduleRepo.create(s));
    }
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
//# sourceMappingURL=seed.js.map