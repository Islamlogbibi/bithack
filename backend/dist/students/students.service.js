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
    repo;
    usersRepo;
    gradeRepo;
    presenceRepo;
    specRepo;
    levelRepo;
    sectionRepo;
    groupRepo;
    constructor(repo, usersRepo, gradeRepo, presenceRepo, specRepo, levelRepo, sectionRepo, groupRepo) {
        this.repo = repo;
        this.usersRepo = usersRepo;
        this.gradeRepo = gradeRepo;
        this.presenceRepo = presenceRepo;
        this.specRepo = specRepo;
        this.levelRepo = levelRepo;
        this.sectionRepo = sectionRepo;
        this.groupRepo = groupRepo;
    }
    async list(filters) {
        const qb = this.repo.createQueryBuilder('student')
            .leftJoinAndSelect('student.user', 'user')
            .leftJoinAndSelect('student.speciality', 'speciality')
            .leftJoinAndSelect('student.level', 'level')
            .leftJoinAndSelect('student.section', 'section')
            .leftJoinAndSelect('student.group', 'group');
        if (filters.query) {
            qb.andWhere('(LOWER(user.fullName) LIKE :q OR student.matricule LIKE :q)', {
                q: `%${filters.query.toLowerCase()}%`,
            });
        }
        if (filters.speciality) {
            const specialityId = Number(filters.speciality);
            if (Number.isFinite(specialityId)) {
                qb.andWhere('speciality.id = :specialityId', { specialityId });
            }
            else {
                qb.andWhere('(LOWER(speciality.libelle) = :specialityName OR LOWER(speciality.name) = :specialityName)', {
                    specialityName: filters.speciality.toLowerCase(),
                });
            }
        }
        if (filters.level) {
            const levelId = Number(filters.level);
            if (Number.isFinite(levelId)) {
                qb.andWhere('level.id = :levelId', { levelId });
            }
            else {
                qb.andWhere('LOWER(level.libelle) = :levelName', { levelName: filters.level.toLowerCase() });
            }
        }
        if (filters.section) {
            const sectionId = Number(filters.section);
            if (Number.isFinite(sectionId)) {
                qb.andWhere('section.id = :sectionId', { sectionId });
            }
            else {
                qb.andWhere('LOWER(section.code) = :sectionCode', { sectionCode: filters.section.toLowerCase() });
            }
        }
        if (filters.group) {
            const groupId = Number(filters.group);
            if (Number.isFinite(groupId)) {
                qb.andWhere('group.id = :groupId', { groupId });
            }
            else {
                qb.andWhere('LOWER(group.code) = :groupCode', { groupCode: filters.group.toLowerCase() });
            }
        }
        return qb.getMany();
    }
    async findByUserId(userId) {
        return this.repo.findOne({
            where: { user: { id: userId } },
            relations: [
                'user',
                'speciality',
                'level',
                'section',
                'group',
                'grades',
                'grades.course',
                'presences'
            ]
        });
    }
    async create(payload) {
        const passwordHash = await bcrypt.hash(payload.password || 'password123', 10);
        const user = await this.usersRepo.save(this.usersRepo.create({
            fullName: payload.name,
            email: payload.email,
            passwordHash,
            role: 'student',
        }));
        const speciality = await this.specRepo.findOne({ where: { id: payload.specialityId } });
        const level = await this.levelRepo.findOne({ where: { id: payload.levelId } });
        const section = await this.sectionRepo.findOne({ where: { id: payload.sectionId } });
        const group = await this.groupRepo.findOne({ where: { id: payload.groupId } });
        return this.repo.save(this.repo.create({
            user,
            matricule: payload.matricule,
            speciality,
            level,
            section,
            group,
        }));
    }
    async remove(id) {
        const student = await this.repo.findOne({ where: { id }, relations: ['user'] });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        await this.repo.delete(id);
        await this.usersRepo.delete(student.user.id);
        return { success: true };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.StudentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.GradeEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.PresenceEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.SpecialityEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.LevelEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(entities_1.SectionEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(entities_1.GroupEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StudentsService);
//# sourceMappingURL=students.service.js.map