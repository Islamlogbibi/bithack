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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const students_service_1 = require("../students/students.service");
const teachers_service_1 = require("../teachers/teachers.service");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
let AuthService = class AuthService {
    usersService;
    jwtService;
    studentsService;
    teachersService;
    scheduleRepo;
    constructor(usersService, jwtService, studentsService, teachersService, scheduleRepo) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.studentsService = studentsService;
        this.teachersService = teachersService;
        this.scheduleRepo = scheduleRepo;
    }
    async login(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isMatch = await bcrypt.compare(pass, user.passwordHash);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            role: user.role,
            email: user.email,
        });
        const profile = await this.buildProfile(user.id);
        return { accessToken, profile };
    }
    async profileForUserId(userId) {
        return this.buildProfile(userId);
    }
    async buildProfile(userId) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        if (user.role === 'student') {
            const student = await this.studentsService.findByUserId(userId);
            if (!student)
                return { id: user.id, name: user.fullName, email: user.email, role: 'student' };
            const schedules = await this.scheduleRepo.find({
                where: [
                    { group: { id: student.group?.id } },
                    { section: { id: student.section?.id } }
                ],
                relations: ['course', 'course.teacher', 'course.teacher.user'],
                order: { dateSeance: 'ASC', heureDebut: 'ASC' }
            });
            return {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: 'student',
                matricule: student.matricule,
                speciality: student.speciality?.libelle,
                level: student.level?.libelle,
                section: student.section?.code,
                group: student.group?.code,
                gpa: student.average,
                grades: student.grades?.map(g => ({
                    subject: g.course?.intitule,
                    value: g.valeur,
                    status: g.statut,
                    credits: g.course?.credits
                })) || [],
                schedule: schedules.map(s => ({
                    day: s.dateSeance,
                    time: s.heureDebut,
                    subject: s.course?.intitule,
                    room: s.salle,
                    teacher: s.course?.teacher?.user?.fullName
                }))
            };
        }
        if (user.role === 'teacher') {
            const teacher = await this.teachersService.findByUserId(userId);
            if (!teacher)
                return { id: user.id, name: user.fullName, email: user.email, role: 'teacher' };
            return {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: 'teacher',
                department: teacher.department?.libelle,
                orcid: teacher.orcid,
                scopusId: teacher.scopusId,
                courses: teacher.courses?.map(c => ({
                    id: c.id,
                    name: c.intitule,
                    level: c.level?.libelle
                })) || []
            };
        }
        if (user.role === 'admin') {
            return {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: 'admin',
                department: user.department || 'Administration',
                adminStats: user.adminStatsJson || {
                    totalStudents: 1500,
                    pendingValidations: 8,
                    activeAlerts: 12,
                    faculty: 'Faculté des Sciences',
                },
            };
        }
        return { id: user.id, name: user.fullName, email: user.email, role: user.role };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.ScheduleEntity)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        students_service_1.StudentsService,
        teachers_service_1.TeachersService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map