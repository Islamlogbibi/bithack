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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
const SEED = [
    { title: 'Cours Algorithmique — Chapitre 3', subject: 'Algorithmique', type: 'Cours', fileType: 'PDF', teacherName: 'Dr. Meziani', sizeLabel: '2.4 MB', isNew: true },
    { title: 'TD Algorithmique N°5 — Arbres', subject: 'Algorithmique', type: 'TD', fileType: 'PDF', teacherName: 'Dr. Meziani', sizeLabel: '1.1 MB', isNew: true },
    { title: 'Cours Réseaux — Protocoles TCP/IP', subject: 'Réseaux', type: 'Cours', fileType: 'PPT', teacherName: 'Dr. Boualem', sizeLabel: '5.6 MB', isNew: false },
    { title: 'TP Réseaux — Configuration Router', subject: 'Réseaux', type: 'TP', fileType: 'PDF', teacherName: 'Dr. Boualem', sizeLabel: '0.8 MB', isNew: false },
    { title: 'Cours Base de Données — SQL Avancé', subject: 'Bases de données', type: 'Cours', fileType: 'PDF', teacherName: 'Mme. Rahmani', sizeLabel: '3.2 MB', isNew: false },
    { title: 'Examen BDD 2024 — Corrigé', subject: 'Bases de données', type: 'Exam', fileType: 'PDF', teacherName: 'Mme. Rahmani', sizeLabel: '0.6 MB', isNew: false },
    { title: 'Cours Mathématiques — Analyse', subject: 'Mathématiques', type: 'Cours', fileType: 'PDF', teacherName: 'Dr. Laadj', sizeLabel: '4.1 MB', isNew: false },
    { title: 'TD Anglais Technique N°3', subject: 'Anglais Technique', type: 'TD', fileType: 'DOC', teacherName: 'Mme. Ferhat', sizeLabel: '0.4 MB', isNew: false },
    { title: 'Cours Génie Logiciel — UML', subject: 'Génie Logiciel', type: 'Cours', fileType: 'PDF', teacherName: 'Dr. Taleb', sizeLabel: '2.1 MB', isNew: true },
    { title: 'Cours Intelligence Artificielle — CNN', subject: 'Intelligence Artificielle', type: 'Cours', fileType: 'PDF', teacherName: 'Dr. Benmoussa', sizeLabel: '3.5 MB', isNew: true },
];
let ResourcesService = class ResourcesService {
    resourceRepo;
    constructor(resourceRepo) {
        this.resourceRepo = resourceRepo;
    }
    async onModuleInit() {
        const count = await this.resourceRepo.count();
        if (count > 0)
            return;
        await this.resourceRepo.save(this.resourceRepo.create(SEED));
    }
    list() {
        return this.resourceRepo.find({ order: { createdAt: 'DESC' } });
    }
    create(payload) {
        return this.resourceRepo.save(this.resourceRepo.create(payload));
    }
    remove(id) {
        return this.resourceRepo.delete(id);
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ResourceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map