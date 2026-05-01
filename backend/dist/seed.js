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
    const messageRepo = dataSource.getRepository(entities_1.MessageEntity);
    const specialityRepo = dataSource.getRepository(entities_1.SpecialityEntity);
    const admin1 = await userRepo.save(userRepo.create({
        email: 'admin@pui.dz',
        passwordHash,
        fullName: 'Prof. Amina Hadj',
        role: 'admin',
        department: 'Département Informatique',
        adminStatsJson: {
            totalStudents: 1500,
            activeTeachers: 90,
            pendingValidations: 15,
            avgAttendance: 88,
            publishedResources: 450,
        },
    }));
    const dean = await userRepo.save(userRepo.create({
        email: 'dean@pui.dz',
        passwordHash,
        fullName: 'Pr. Samia Belkacem',
        role: 'dean',
        faculty: 'Faculté des Nouvelles Technologies',
    }));
    const teacherNames = [
        'Dr. Karim Meziani', 'Dr. Mourad Bakri', 'Mme. Sarah Hamid',
        'Dr. Amine Boualem', 'Pr. Leila Taleb', 'Dr. Farid Kessas',
        'Mme. Nadia Slim', 'Dr. Yacine Benmoussa'
    ];
    const teacherDept = 'Informatique';
    const subjectsPool = [
        'Algorithmique', 'Bases de données', 'Systèmes d\'exploitation',
        'Réseaux', 'Analyse Numérique', 'Probabilités',
        'Génie Logiciel', 'Compilation', 'Sécurité Informatique',
        'Intelligence Artificielle', 'Développement Web'
    ];
    const teachers = [];
    for (const name of teacherNames) {
        const email = name.toLowerCase().replace(/\s+/g, '.').replace('dr.', 'd').replace('mme.', 'm').replace('pr.', 'p') + '@pui.dz';
        const user = await userRepo.save(userRepo.create({
            email,
            passwordHash,
            fullName: name,
            role: 'teacher',
            department: teacherDept,
        }));
        const teacher = await teacherRepo.save(teacherRepo.create({
            user,
            department: teacherDept,
            hoursPlanned: 160,
            hoursCompleted: 40 + Math.floor(Math.random() * 40),
            subjectsJson: [subjectsPool[Math.floor(Math.random() * subjectsPool.length)], subjectsPool[Math.floor(Math.random() * subjectsPool.length)]],
            groupsJson: ['L3 Info G1', 'L3 Info G2', 'L3 SI G1', 'L3 SI G2'],
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
    const fields = ['Info', 'SI'];
    const levels = ['L3', 'L1', 'L2', 'M1', 'M2'];
    const sections = ['A', 'B'];
    const groups = ['G1', 'G2'];
    let studentIdCounter = 1;
    const allStudents = [];
    console.log('Generating students and specialities...');
    for (const field of fields) {
        for (const level of levels) {
            for (const section of sections) {
                for (const group of groups) {
                    await specialityRepo.save(specialityRepo.create({
                        name: field,
                        level: level,
                        section: section,
                        groupName: `${level} ${field} ${group}`,
                    }));
                    for (let i = 1; i <= 5; i++) {
                        const mat = `2024${String(studentIdCounter).padStart(4, '0')}`;
                        const studentUser = await userRepo.save(userRepo.create({
                            email: `student${studentIdCounter}@pui.dz`,
                            passwordHash,
                            fullName: `Etudiant ${studentIdCounter}`,
                            role: 'student',
                        }));
                        const studentAbs = Math.floor(Math.random() * 6);
                        const student = await studentRepo.save(studentRepo.create({
                            user: studentUser,
                            matricule: mat,
                            speciality: field,
                            level: level,
                            section: section,
                            groupName: `${level} ${field} ${group}`,
                            average: 10 + Math.random() * 8,
                            absences: studentAbs,
                            yearLabel: `${level} ${field}`,
                            displayFaculty: 'Nouvelles Technologies',
                            displayDepartment: 'Informatique',
                            gradesJson: [
                                { subject: 'Algorithmique', td: 12 + Math.random() * 4, exam: 10 + Math.random() * 6, final: 11 + Math.random() * 5, status: 'Validé', credits: 6 },
                                { subject: 'Bases de données', td: 11 + Math.random() * 5, exam: null, final: null, status: 'En attente', credits: 4 },
                            ],
                            absencesByModuleJson: {
                                'Algorithmique': Math.floor(studentAbs / 2),
                                'Bases de données': studentAbs - Math.floor(studentAbs / 2),
                            },
                            gpaByPeriodJson: [
                                { year: '2023', semester: 'S1', gpa: 11 + Math.random() * 4 },
                                { year: '2023', semester: 'S2', gpa: 12 + Math.random() * 3 },
                            ],
                        }));
                        allStudents.push(student);
                        studentIdCounter++;
                    }
                    await scheduleRepo.save(scheduleRepo.create({
                        day: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'][Math.floor(Math.random() * 5)],
                        time: '08:00',
                        subject: subjectsPool[Math.floor(Math.random() * subjectsPool.length)],
                        room: `Amphi ${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`,
                        type: 'Cours',
                        scope: 'group',
                        scopeId: group,
                    }));
                }
            }
        }
    }
    await resourceRepo.save([
        { title: 'Cours Algorithmique L1', subject: 'Algorithmique', type: 'Cours', fileType: 'PDF', teacherName: 'Dr. Karim Meziani', sizeLabel: '1.2 MB', isNew: true },
        { title: 'TD Bases de données L2', subject: 'Bases de données', type: 'TD', fileType: 'PDF', teacherName: 'Dr. Mourad Bakri', sizeLabel: '0.8 MB', isNew: false },
        { title: 'Projet Génie Logiciel M1', subject: 'Génie Logiciel', type: 'Cours', fileType: 'PDF', teacherName: 'Pr. Leila Taleb', sizeLabel: '3.5 MB', isNew: true },
    ]);
    for (let i = 0; i < 10; i++) {
        const randomStudent = allStudents[Math.floor(Math.random() * allStudents.length)];
        await justificationRepo.save(justificationRepo.create({
            student: randomStudent,
            module: subjectsPool[Math.floor(Math.random() * subjectsPool.length)],
            fileName: `justif_${randomStudent.matricule}_${i}.pdf`,
            status: 'pending',
        }));
    }
    for (let i = 0; i < 5; i++) {
        const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
        await validationRepo.save(validationRepo.create({
            teacherName: randomTeacher.user.fullName,
            module: subjectsPool[Math.floor(Math.random() * subjectsPool.length)],
            groupName: 'G1',
            count: 25,
            status: 'pending',
            slaHours: 2 + Math.floor(Math.random() * 20),
            studentGradesJson: [
                { student: 'Etudiant Test', matricule: '20240000', grade: 14.5 },
            ]
        }));
    }
    for (let i = 0; i < 8; i++) {
        const randomStudent = allStudents[Math.floor(Math.random() * allStudents.length)];
        await alertRepo.save(alertRepo.create({
            student: randomStudent,
            subject: subjectsPool[Math.floor(Math.random() * subjectsPool.length)],
            risk: i % 3 === 0 ? 'high' : 'medium',
            status: 'open',
            absenceCount: 5,
            maxAllowed: 6,
        }));
    }
    const samplePdfBase64 = "JVBERi0xLjQKMSAwIG9iago8PCAvVGl0bGUgKFNhbXBsZSkgL0NyZWF0b3IgKE9TQ0EpID4+CmVuZG9iagoyIDAgb2JqCjw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAzIDAgUiA+PgplbmRvYmoKMyAwIG9iago8PCAvVHlwZSAvUGFnZXMgL0NvdW50IDEgL0tpZHMgWzQgIDAgUiVdID4+CmVuZG9iago0IDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMyAwIFIgL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDUgIDAgUiA+PgplbmRvYmoKNSAwIG9iago8PCAvTGVuZ3RoIDQ0ID4+CnN0cmVhbQpCVCAvRjEgMjQgVGYgMTAwIDcwMCBUZCAoRmljaGllciBSZWVsIFVwbG9hZGVkKSBUaiBfRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYKMDAwMDAwMDAxMCAwMDAwMCBuCjAwMDAwMDAwNzkgMDAwMDAgbgowMDAwMDAwMTI4IDAwMDAwIG4KMDAwMDAwMDE4OCAwMDAwMCBuCjAwMDAwMDAyODIgMDAwMDAgbgp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMiAwIFIgPj4Kc3RhcnR4cmVmCjM3NwolJUVPRg==";
    await resourceRepo.save(resourceRepo.create({
        title: 'Support de Cours Officiel - Algorithmique',
        subject: 'Algorithmique',
        type: 'Cours',
        fileType: 'PDF',
        teacherName: 'Dr. Meziani',
        sizeLabel: '0.5 MB',
        isNew: true,
        fileContent: samplePdfBase64,
        groupsJson: ['L3 Info G1', 'L3 Info G2', 'L3 Info G3']
    }));
    console.log('Seeding completed successfully!');
    await app.close();
}
bootstrap().catch((err) => {
    console.error('Error during seeding:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map