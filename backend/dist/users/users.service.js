"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    usersRepo;
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }
    async onModuleInit() {
        const count = await this.usersRepo.count();
        if (count > 0)
            return;
        await this.createSeedUser('student@pui.dz', 'student123', 'Mabrouk Benali', 'student');
        await this.createSeedUser('teacher@pui.dz', 'teacher123', 'Dr. Karim Meziani', 'teacher');
        const admin = await this.createSeedUser('admin@pui.dz', 'admin123', 'Prof. Amina Hadj', 'admin');
        admin.department = 'Département Informatique';
        admin.adminStatsJson = {
            totalStudents: 342,
            activeTeachers: 28,
            pendingValidations: 7,
            avgAttendance: 87,
            publishedResources: 156,
        };
        await this.usersRepo.save(admin);
        const dean = await this.createSeedUser('dean@pui.dz', 'dean123', 'Pr. Samia Belkacem', 'dean');
        dean.faculty = 'Faculté des Sciences et Technologies';
        await this.usersRepo.save(dean);
        const extraAccounts = [
            { email: 'k.bouzid@pui.dz', password: 'student123', name: 'Khalil Bouzid' },
            { email: 'r.slimani@pui.dz', password: 'student123', name: 'Rania Slimani' },
            { email: 'f.taleb@pui.dz', password: 'student123', name: 'Fares Taleb' },
            { email: 'h.amrani@pui.dz', password: 'student123', name: 'Houda Amrani' },
        ];
        for (const a of extraAccounts) {
            await this.createSeedUser(a.email, a.password, a.name, 'student');
        }
    }
    findByEmail(email) {
        return this.usersRepo.findOne({ where: { email } });
    }
    findById(id) {
        return this.usersRepo.findOne({ where: { id } });
    }
    async createSeedUser(email, password, fullName, role) {
        const passwordHash = await bcrypt.hash(password, 10);
        return this.usersRepo.save(this.usersRepo.create({
            email,
            passwordHash,
            fullName,
            role,
        }));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map