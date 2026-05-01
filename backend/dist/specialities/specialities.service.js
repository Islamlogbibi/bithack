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
    constructor(repo) {
        this.repo = repo;
    }
    async onModuleInit() {
        const rows = [
            { name: 'Informatique', level: 'L2', section: 'A', groupName: 'G1' },
            { name: 'Informatique', level: 'L2', section: 'A', groupName: 'G2' },
            { name: 'Informatique', level: 'L3', section: 'A', groupName: 'G1' },
            { name: 'Informatique', level: 'L3', section: 'A', groupName: 'G2' },
            { name: 'Informatique', level: 'L3', section: 'B', groupName: 'G3' },
        ];
        for (const row of rows) {
            const exists = await this.repo.exist({ where: row });
            if (!exists)
                await this.repo.save(this.repo.create(row));
        }
    }
    list() {
        return this.repo.find();
    }
};
exports.SpecialitiesService = SpecialitiesService;
exports.SpecialitiesService = SpecialitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.SpecialityEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SpecialitiesService);
//# sourceMappingURL=specialities.service.js.map