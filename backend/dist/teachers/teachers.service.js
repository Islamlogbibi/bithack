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
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
const PENDING_GRADES = [
    { student: 'Ahmed Bouali', matricule: '202012301', group: 'G1', td: 14, exam: null, status: 'En attente' },
    { student: 'Sara Mansouri', matricule: '202012302', group: 'G1', td: 16, exam: null, status: 'En attente' },
    { student: 'Yacine Ferhat', matricule: '202012303', group: 'G2', td: 11, exam: null, status: 'En attente' },
    { student: 'Nadia Cherif', matricule: '202012304', group: 'G2', td: 15, exam: null, status: 'En attente' },
    { student: 'Omar Bensalem', matricule: '202012305', group: 'G3', td: 9, exam: null, status: 'En attente' },
];
let TeachersService = class TeachersService {
    teachersRepo;
    usersRepo;
    constructor(teachersRepo, usersRepo) {
        this.teachersRepo = teachersRepo;
        this.usersRepo = usersRepo;
    }
    async onModuleInit() {
        const count = await this.teachersRepo.count();
        if (count > 0)
            return;
        const user = await this.usersRepo.findOne({ where: { email: 'teacher@pui.dz' } });
        if (!user)
            return;
        await this.teachersRepo.save(this.teachersRepo.create({
            user,
            department: 'Informatique',
            hoursPlanned: 96,
            hoursCompleted: 72,
            subjectsJson: ['Algorithmique', 'Structures de Données'],
            groupsJson: ['G1', 'G2', 'G3'],
            pendingGradesJson: PENDING_GRADES,
        }));
    }
    list() {
        return this.teachersRepo.find();
    }
    findByUserId(userId) {
        return this.teachersRepo.findOne({ where: { user: { id: userId } }, relations: { user: true } });
    }
    async update(id, data) {
        await this.teachersRepo.update(id, data);
        return this.teachersRepo.findOne({ where: { id }, relations: { user: true } });
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TeacherEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map