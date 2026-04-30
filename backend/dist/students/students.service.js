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
        const defaultStudentUser = await this.usersRepo.findOne({
            where: { email: 'student@pui.dz' },
        });
        if (!defaultStudentUser)
            return;
        await this.studentsRepo.save(this.studentsRepo.create({
            user: defaultStudentUser,
            matricule: '202012345',
            speciality: 'Informatique',
            level: 'L3',
            section: 'A',
            groupName: 'G2',
            average: 14.7,
            absences: 4,
        }));
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