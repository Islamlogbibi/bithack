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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let AttendanceService = class AttendanceService {
    alertRepo;
    studentRepo;
    constructor(alertRepo, studentRepo) {
        this.alertRepo = alertRepo;
        this.studentRepo = studentRepo;
    }
    async listAlerts() {
        return this.alertRepo.find({
            where: { dismissed: false },
            relations: ['student', 'student.user'],
            order: { createdAt: 'DESC' },
        });
    }
    async createAlert(data) {
        const student = await this.studentRepo.findOne({ where: { id: data.studentId } });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const alert = this.alertRepo.create({
            student,
            module: data.module,
            absences: data.absences,
            severity: data.severity,
        });
        return this.alertRepo.save(alert);
    }
    async dismissAlert(id) {
        return this.alertRepo.update(id, { dismissed: true });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.AttendanceAlertEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.StudentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map