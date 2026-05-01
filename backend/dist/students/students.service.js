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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
const bcrypt = __importStar(require("bcrypt"));
const MAIN_GRADES = [
    { subject: 'Algorithmique', td: 13, exam: 15, final: 14.2, status: 'Validé', credits: 6 },
    { subject: 'Réseaux', td: 16, exam: 14, final: 14.8, status: 'Validé', credits: 4 },
    { subject: 'Base de Données', td: 12, exam: 11, final: 11.4, status: 'En attente', credits: 5 },
    { subject: 'Mathématiques', td: 17, exam: 16, final: 16.4, status: 'Validé', credits: 4 },
    { subject: 'Anglais Technique', td: 15, exam: 14, final: 14.6, status: 'Validé', credits: 2 },
];
let StudentsService = class StudentsService {
    studentsRepo;
    usersRepo;
    constructor(studentsRepo, usersRepo) {
        this.studentsRepo = studentsRepo;
        this.usersRepo = usersRepo;
    }
    async onModuleInit() {
        const count = await this.studentsRepo.count();
        if (count > 0)
            return;
        const mainUser = await this.usersRepo.findOne({ where: { email: 'student@pui.dz' } });
        if (!mainUser)
            return;
        await this.studentsRepo.save(this.studentsRepo.create({
            user: mainUser,
            matricule: '202012345',
            speciality: 'Informatique',
            level: 'L3',
            section: 'A',
            groupName: 'G2',
            average: 14.7,
            absences: 4,
            yearLabel: 'L3 Informatique',
            gradesJson: MAIN_GRADES,
            absencesByModuleJson: { algo: 4, networks: 1, db: 2 },
            displayFaculty: 'Faculté des Sciences et Technologies',
            displayDepartment: 'Informatique',
            displayModule: 'Algorithmique',
            notesJson: [14.2, 14.8, 11.4, 16.4],
            gpaByPeriodJson: [
                { year: '2024-2025', semester: 'S1', gpa: 14.2 },
                { year: '2024-2025', semester: 'S2', gpa: 14.7 },
            ],
        }));
        const extras = [
            {
                email: 'k.bouzid@pui.dz',
                matricule: '202012201',
                speciality: 'Informatique',
                level: 'L3',
                section: 'A',
                groupName: 'G1',
                average: 10.9,
                absences: 5,
                displayFaculty: 'Faculté des Sciences et Technologies',
                displayDepartment: 'Informatique',
                displayModule: 'Mathématiques',
                notesJson: [8.3, 11.7, 12.2, 11.4],
                gpaByPeriodJson: [
                    { year: '2024-2025', semester: 'S1', gpa: 10.5 },
                    { year: '2024-2025', semester: 'S2', gpa: 10.9 },
                ],
            },
            {
                email: 'r.slimani@pui.dz',
                matricule: '202012202',
                speciality: 'Informatique',
                level: 'L3',
                section: 'B',
                groupName: 'G3',
                average: 11.8,
                absences: 5,
                displayFaculty: 'Faculté des Sciences et Technologies',
                displayDepartment: 'Informatique',
                displayModule: 'Réseaux',
                notesJson: [9.5, 12.8, 13.1, 11.7],
                gpaByPeriodJson: [
                    { year: '2024-2025', semester: 'S1', gpa: 11.2 },
                    { year: '2024-2025', semester: 'S2', gpa: 11.8 },
                ],
            },
            {
                email: 'f.taleb@pui.dz',
                matricule: '202012203',
                speciality: 'Informatique',
                level: 'L3',
                section: 'A',
                groupName: 'G1',
                average: 11.2,
                absences: 4,
                displayFaculty: 'Faculté des Sciences et Technologies',
                displayDepartment: 'Informatique',
                displayModule: 'Réseaux',
            },
            {
                email: 'h.amrani@pui.dz',
                matricule: '202012204',
                speciality: 'Informatique',
                level: 'L3',
                section: 'A',
                groupName: 'G1',
                average: 12.5,
                absences: 3,
                displayFaculty: 'Faculté des Sciences et Technologies',
                displayDepartment: 'Informatique',
                displayModule: 'Mathématiques',
            },
        ];
        for (const row of extras) {
            const { email, ...rest } = row;
            const u = await this.usersRepo.findOne({ where: { email } });
            if (!u)
                continue;
            await this.studentsRepo.save(this.studentsRepo.create({ user: u, ...rest }));
        }
    }
    async list(filters) {
        const qb = this.studentsRepo.createQueryBuilder('student').leftJoinAndSelect('student.user', 'user');
        if (filters.query) {
            qb.andWhere('(LOWER(user.fullName) LIKE :q OR student.matricule LIKE :q)', {
                q: `%${filters.query.toLowerCase()}%`,
            });
        }
        if (filters.speciality)
            qb.andWhere('student.speciality = :speciality', { speciality: filters.speciality });
        if (filters.level)
            qb.andWhere('student.level = :level', { level: filters.level });
        if (filters.section)
            qb.andWhere('student.section = :section', { section: filters.section });
        if (filters.group)
            qb.andWhere('student.groupName = :groupName', { groupName: filters.group });
        return qb.getMany();
    }
    async findByUserId(userId) {
        return this.studentsRepo.findOne({ where: { user: { id: userId } }, relations: { user: true } });
    }
    async create(payload) {
        const passwordHash = await bcrypt.hash(payload.password, 10);
        const user = await this.usersRepo.save(this.usersRepo.create({
            fullName: payload.name,
            email: payload.email,
            passwordHash,
            role: 'student',
        }));
        return this.studentsRepo.save(this.studentsRepo.create({
            user,
            matricule: payload.matricule,
            speciality: payload.speciality,
            level: payload.level,
            section: payload.section,
            groupName: payload.group,
        }));
    }
    async remove(id) {
        const student = await this.studentsRepo.findOne({ where: { id }, relations: { user: true } });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        await this.studentsRepo.delete(id);
        await this.usersRepo.delete(student.user.id);
        return { success: true };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.StudentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StudentsService);
//# sourceMappingURL=students.service.js.map