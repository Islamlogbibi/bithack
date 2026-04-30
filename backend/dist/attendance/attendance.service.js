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
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
let AttendanceService = class AttendanceService {
    repo;
    studentsRepo;
    usersRepo;
    constructor(repo, studentsRepo, usersRepo) {
        this.repo = repo;
        this.studentsRepo = studentsRepo;
        this.usersRepo = usersRepo;
    }
    async onModuleInit() {
        const count = await this.repo.count();
        if (count > 0)
            return;
        const student = await this.studentsRepo.findOne({ where: { matricule: '202012345' } });
        if (!student)
            return;
        await this.repo.save(this.repo.create([
            { student, subject: 'Algorithmique', risk: 'high', status: 'open' },
            { student, subject: 'Base de Données', risk: 'medium', status: 'open' },
            { student, subject: 'Réseaux', risk: 'low', status: 'open' },
        ]));
    }
    alerts() {
        return this.repo.find();
    }
    dismiss(id) {
        return this.repo.update({ id }, { status: 'dismissed' });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.AttendanceAlertEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.StudentEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map