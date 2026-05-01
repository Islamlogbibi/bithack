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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let TeachersService = class TeachersService {
    repo;
    moduleRepo;
    constructor(repo, moduleRepo) {
        this.repo = repo;
        this.moduleRepo = moduleRepo;
    }
    async list() {
        const teachers = await this.repo.find({ relations: ['user', 'modules'] });
        return teachers.map(t => ({
            id: t.id,
            name: t.user.fullName,
            email: t.user.email,
            department: t.department,
            hoursPlanned: t.hoursPlanned,
            hoursCompleted: t.hoursCompleted,
            subjects: [...new Set(t.modules?.map(m => m.subject) || [])],
            groups: [...new Set(t.modules?.map(m => m.groupName) || [])],
            academicCv: t.academicCvJson,
        }));
    }
    async findByUserId(userId) {
        return this.repo.findOne({
            where: { user: { id: userId } },
            relations: ['user', 'modules'],
        });
    }
    async update(id, data) {
        const teacher = await this.repo.findOne({ where: { id }, relations: ['modules'] });
        if (!teacher)
            return;
        if (data.department !== undefined)
            teacher.department = data.department;
        if (data.hoursPlanned !== undefined)
            teacher.hoursPlanned = data.hoursPlanned;
        if (data.subjects !== undefined || data.groups !== undefined) {
            const subjects = data.subjects || [...new Set(teacher.modules?.map(m => m.subject) || [])];
            const groups = data.groups || [...new Set(teacher.modules?.map(m => m.groupName) || [])];
            await this.moduleRepo.delete({ teacher: { id: teacher.id } });
            for (const s of subjects) {
                for (const g of groups) {
                    await this.moduleRepo.save(this.moduleRepo.create({
                        teacher,
                        subject: s,
                        groupName: g
                    }));
                }
            }
        }
        return this.repo.save(teacher);
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TeacherEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.TeacherModuleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map