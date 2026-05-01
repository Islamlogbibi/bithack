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
exports.JustificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let JustificationsService = class JustificationsService {
    repo;
    studentRepo;
    constructor(repo, studentRepo) {
        this.repo = repo;
        this.studentRepo = studentRepo;
    }
    async list() {
        return this.repo.find({
            relations: ['student', 'student.user'],
            order: { submittedAt: 'DESC' }
        });
    }
    async create(data) {
        const student = await this.studentRepo.findOne({ where: { id: data.studentId } });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const justification = this.repo.create({
            student,
            module: data.module,
            fileName: data.fileName,
            fileContent: data.fileContent,
            absenceDate: data.absenceDate,
            status: 'pending',
        });
        return this.repo.save(justification);
    }
    async review(id, data) {
        const justification = await this.repo.findOne({ where: { id } });
        if (!justification)
            throw new common_1.NotFoundException('Justification not found');
        justification.status = data.status;
        justification.reviewComment = data.reviewComment || '';
        return this.repo.save(justification);
    }
};
exports.JustificationsService = JustificationsService;
exports.JustificationsService = JustificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.JustificationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.StudentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], JustificationsService);
//# sourceMappingURL=justifications.service.js.map