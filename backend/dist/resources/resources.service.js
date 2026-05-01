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
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let ResourcesService = class ResourcesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async list() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
    async create(data) {
        const resource = this.repo.create({
            ...data,
            date: data.date ?? new Date().toISOString().slice(0, 10),
            size: data.size ?? data.sizeLabel ?? '—',
            url: data.url ?? '#',
            type: data.type ?? 'Cours',
            subject: data.subject ?? '',
            fileType: data.fileType ?? 'PDF',
            teacherName: data.teacherName ?? '',
            sizeLabel: data.sizeLabel ?? data.size ?? '—',
            isNew: Boolean(data.isNew),
            fileContent: data.fileContent ?? null,
            groupsJson: data.groupsJson ?? null,
            specialityName: data.specialityName ?? null,
            levelName: data.levelName ?? null,
            sectionName: data.sectionName ?? null,
            groupName: data.groupName ?? null,
        });
        return this.repo.save(resource);
    }
    async delete(id) {
        return this.repo.delete(id);
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ResourceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map