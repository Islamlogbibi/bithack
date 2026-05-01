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
exports.SpecialitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
let SpecialitiesService = class SpecialitiesService {
    repo;
    levelRepo;
    constructor(repo, levelRepo) {
        this.repo = repo;
        this.levelRepo = levelRepo;
    }
    async list() {
        return this.repo.find();
    }
    async getTree() {
        const levels = await this.levelRepo.find({
            relations: ['speciality', 'sections', 'sections.groups'],
            order: {
                speciality: { libelle: 'ASC' },
                libelle: 'ASC',
                sections: { code: 'ASC', groups: { code: 'ASC' } },
            },
        });
        const tree = new Map();
        for (const level of levels) {
            const specialityName = level.speciality?.libelle || level.speciality?.name || 'Unknown';
            if (!tree.has(specialityName)) {
                tree.set(specialityName, { speciality: specialityName, levels: [] });
            }
            const specialityNode = tree.get(specialityName);
            specialityNode.levels.push({
                level: level.libelle,
                sections: (level.sections || []).map((section) => ({
                    section: section.code,
                    groups: (section.groups || []).map((group) => ({
                        group: group.code,
                        students: [],
                        modules: [],
                        teachers: [],
                    })),
                })),
            });
        }
        return Array.from(tree.values());
    }
};
exports.SpecialitiesService = SpecialitiesService;
exports.SpecialitiesService = SpecialitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.SpecialityEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.LevelEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SpecialitiesService);
//# sourceMappingURL=specialities.service.js.map