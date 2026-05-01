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
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
let SchedulesService = class SchedulesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async onModuleInit() {
        const count = await this.repo.count();
        if (count > 0)
            return;
        await this.repo.save(this.repo.create([
            { day: 'Dimanche', time: '08:00', subject: 'Algorithmique', room: 'Salle A12', type: 'Cours', scope: 'group', scopeId: 'G2' },
            { day: 'Dimanche', time: '10:00', subject: 'Réseaux', room: 'Labo R3', type: 'TP', scope: 'group', scopeId: 'G2' },
            { day: 'Lundi', time: '08:00', subject: 'Base de Données', room: 'Salle B04', type: 'TD', scope: 'group', scopeId: 'G2' },
            { day: 'Lundi', time: '14:00', subject: 'Mathématiques', room: 'Salle A08', type: 'Cours', scope: 'group', scopeId: 'G2' },
            { day: 'Mardi', time: '10:00', subject: 'Algorithmique', room: 'Labo Info', type: 'TP', scope: 'group', scopeId: 'G2' },
            { day: 'Mercredi', time: '08:00', subject: 'Anglais Technique', room: 'Salle C02', type: 'TD', scope: 'group', scopeId: 'G2' },
            { day: 'Dimanche', time: '10:00', subject: 'Réseaux', room: 'Labo R3', type: 'TP', scope: 'group', scopeId: 'G1' },
            { day: 'Lundi', time: '08:00', subject: 'Base de Données', room: 'Salle B04', type: 'TD', scope: 'group', scopeId: 'G1' },
            { day: 'Samedi', time: '10:00', subject: 'Projet tutoré', room: 'Labo P2', type: 'TP', scope: 'group', scopeId: 'G1' },
        ]));
    }
    byScope(scope, scopeId) {
        return this.repo.find({ where: { scope: scope, scopeId } });
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ScheduleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map