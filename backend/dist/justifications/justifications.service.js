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
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
let JustificationsService = class JustificationsService {
    justificationsRepo;
    studentsRepo;
    constructor(justificationsRepo, studentsRepo) {
        this.justificationsRepo = justificationsRepo;
        this.studentsRepo = studentsRepo;
    }
    async onModuleInit() {
        const count = await this.justificationsRepo.count();
        if (count > 0)
            return;
        const s1 = await this.studentsRepo.findOne({ where: { matricule: '202012345' } });
        const s2 = await this.studentsRepo.findOne({ where: { matricule: '202012202' } });
        const rows = [];
        if (s1) {
            rows.push({
                student: s1,
                module: 'Algorithmique',
                fileName: 'justification-medicale.pdf',
                status: 'pending',
            });
        }
        if (s2) {
            rows.push({
                student: s2,
                module: 'Réseaux',
                fileName: 'attestation.png',
                status: 'approved',
            });
        }
        if (rows.length)
            await this.justificationsRepo.save(this.justificationsRepo.create(rows));
    }
    list() {
        return this.justificationsRepo.find({ order: { submittedAt: 'DESC' } });
    }
    async create(studentId, module, fileName, fileContent, metadata) {
        const student = await this.studentsRepo.findOneOrFail({ where: { user: { id: studentId } } });
        return this.justificationsRepo.save(this.justificationsRepo.create({
            student,
            module,
            fileName,
            fileContent,
            absenceDate: metadata?.absenceDate,
            absenceDay: metadata?.absenceDay,
            absenceTime: metadata?.absenceTime,
            status: 'pending'
        }));
    }
    async review(id, status, reviewComment) {
        const item = await this.justificationsRepo.findOneOrFail({ where: { id } });
        item.status = status;
        item.reviewComment = reviewComment ?? null;
        return this.justificationsRepo.save(item);
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