"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
const SEED = [
    {
        teacherName: 'Dr. Karim Meziani',
        speciality: 'Informatique',
        module: 'Algorithmique',
        level: 'L2',
        section: 'A',
        groupName: 'G1',
        count: 28,
        submittedAt: '2025-01-10T09:30:00.000Z',
        slaHours: 18,
        studentGradesJson: [
            { student: 'Ahmed Bouali', matricule: '202012301', grade: 15.5 },
            { student: 'Sara Mansouri', matricule: '202012302', grade: 14.8 },
            { student: 'Nadia Cherif', matricule: '202012304', grade: 13.4 },
        ],
    },
    {
        teacherName: 'Dr. Karim Meziani',
        speciality: 'Informatique',
        module: 'Algorithmique',
        level: 'L3',
        section: 'A',
        groupName: 'G2',
        count: 30,
        submittedAt: '2025-01-10T10:15:00.000Z',
        slaHours: 16,
        studentGradesJson: [
            { student: 'Mabrouk Benali', matricule: '202012345', grade: 14.2 },
            { student: 'Lina Sadoud', matricule: '202012322', grade: 16.1 },
            { student: 'Farid Bousselah', matricule: '202012325', grade: 11.7 },
        ],
    },
    {
        teacherName: 'Mme. Rahmani',
        speciality: 'Informatique',
        module: 'Base de Données',
        level: 'L3',
        section: 'A',
        groupName: 'G1',
        count: 27,
        submittedAt: '2025-01-09T14:00:00.000Z',
        slaHours: 6,
        studentGradesJson: [
            { student: 'Yasmine Ounissi', matricule: '202012317', grade: 12.9 },
            { student: 'Fares Taleb', matricule: '202012203', grade: 10.4 },
            { student: 'Ines Hamidi', matricule: '202012319', grade: 13.7 },
        ],
    },
    {
        teacherName: 'Dr. Boualem',
        speciality: 'Informatique',
        module: 'Réseaux',
        level: 'L3',
        section: 'B',
        groupName: 'G3',
        count: 25,
        submittedAt: '2025-01-09T16:30:00.000Z',
        slaHours: 8,
        studentGradesJson: [
            { student: 'Aymen Ghali', matricule: '202012330', grade: 11.2 },
            { student: 'Rania Slimani', matricule: '202012202', grade: 9.5 },
            { student: 'Ilyes Benaissa', matricule: '202012329', grade: 14.1 },
        ],
    },
    {
        teacherName: 'Dr. Laadj',
        speciality: 'Informatique',
        module: 'Mathématiques',
        level: 'L3',
        section: 'A',
        groupName: 'G2',
        count: 29,
        submittedAt: '2025-01-08T11:00:00.000Z',
        slaHours: 2,
        studentGradesJson: [
            { student: 'Khalil Bouzid', matricule: '202012201', grade: 8.3 },
            { student: 'Houda Amrani', matricule: '202012204', grade: 13.6 },
            { student: 'Sonia Bellal', matricule: '202012340', grade: 12.8 },
        ],
    },
    {
        teacherName: 'Mme. Ferhat',
        speciality: 'Informatique',
        module: 'Anglais Technique',
        level: 'L2',
        section: 'A',
        groupName: 'G1',
        count: 26,
        submittedAt: '2025-01-08T15:00:00.000Z',
        slaHours: 4,
        studentGradesJson: [
            { student: 'Nourhane Rebbah', matricule: '202012335', grade: 15.9 },
            { student: 'Omar Bensalem', matricule: '202012305', grade: 10.7 },
            { student: 'Lamia Djeffal', matricule: '202012338', grade: 14.2 },
        ],
    },
    {
        teacherName: 'Dr. Messaoud',
        speciality: 'Informatique',
        module: 'Structures de Données',
        level: 'L3',
        section: 'B',
        groupName: 'G3',
        count: 28,
        submittedAt: '2025-01-07T09:00:00.000Z',
        slaHours: 0,
        studentGradesJson: [
            { student: 'Walid Bensaci', matricule: '202012346', grade: 12.4 },
            { student: 'Kenza Rezig', matricule: '202012347', grade: 14.9 },
            { student: 'Samir Zouaoui', matricule: '202012348', grade: 9.8 },
        ],
    },
];
let ValidationsService = class ValidationsService {
    repo;
    studentRepo;
    constructor(repo, studentRepo) {
        this.repo = repo;
        this.studentRepo = studentRepo;
    }
    async onModuleInit() {
        const count = await this.repo.count();
        if (count > 0)
            return;
        for (const row of SEED) {
            await this.repo.save(this.repo.create({
                ...row,
                submittedAt: new Date(row.submittedAt),
                status: 'pending',
            }));
        }
    }
    list() {
        return this.repo.find({ order: { submittedAt: 'DESC' } });
    }
    create(data) {
        return this.repo.save(this.repo.create({
            teacherName: data.teacherName,
            module: data.module,
            groupName: data.groupName,
            count: data.count,
            slaHours: data.slaHours ?? 24,
            studentGradesJson: data.studentGradesJson ?? [],
            status: 'pending',
        }));
    }
    async review(id, status) {
        const validation = await this.repo.findOne({ where: { id } });
        if (!validation)
            return;
        if (status === 'approved' && validation.studentGradesJson) {
            for (const entry of validation.studentGradesJson) {
                const student = await this.studentRepo.findOne({ where: { matricule: entry.matricule } });
                if (student) {
                    let grades = student.gradesJson || [];
                    const existingIdx = grades.findIndex((g) => g.subject === validation.module);
                    if (existingIdx > -1) {
                        const existingGrade = grades[existingIdx];
                        grades[existingIdx] = {
                            ...existingGrade,
                            exam: entry.grade,
                            final: Math.round((existingGrade.td * 0.4 + entry.grade * 0.6) * 100) / 100,
                            status: entry.grade >= 10 ? 'Validé' : 'Rattrapage'
                        };
                    }
                    else {
                        grades.push({
                            subject: validation.module,
                            td: 10,
                            exam: entry.grade,
                            final: entry.grade,
                            status: entry.grade >= 10 ? 'Validé' : 'Rattrapage',
                            credits: 4
                        });
                    }
                    student.gradesJson = grades;
                    const gradedSubjects = grades.filter((g) => g.final !== null);
                    if (gradedSubjects.length > 0) {
                        let sum = 0;
                        for (const g of gradedSubjects) {
                            sum += g.final || 0;
                        }
                        student.average = Math.round((sum / gradedSubjects.length) * 100) / 100;
                    }
                    await this.studentRepo.save(student);
                }
            }
        }
        return this.repo.update({ id }, { status });
    }
};
exports.ValidationsService = ValidationsService;
exports.ValidationsService = ValidationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ValidationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.StudentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ValidationsService);
//# sourceMappingURL=validations.service.js.map