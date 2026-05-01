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
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const students_service_1 = require("../students/students.service");
const teachers_service_1 = require("../teachers/teachers.service");
const entities_1 = require("../entities");
const bcrypt = __importStar(require("bcrypt"));
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
    async login(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            role: user.role,
            email: user.email,
        });
        const profile = await this.buildProfile(user.id);
        return {
            accessToken,
            profile,
        };
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
            if (!student) {
                return {
                    id: user.id,
                    name: user.fullName,
                    email: user.email,
                    role: 'student',
                    matricule: '',
                    group: '',
                    year: '',
                    gpa: 0,
                    absences: {},
                    grades: [],
                    schedule: [],
                };
            }
            const schedules = await this.scheduleRepo.find({
                where: [{ scope: 'group', scopeId: student.groupName }],
                order: { day: 'ASC', time: 'ASC' },
            });
            const schedule = schedules.map((s) => ({
                day: s.day,
                time: s.time,
                subject: s.subject,
                room: s.room.includes('Salle') || s.room.includes('Labo') ? s.room : `Salle ${s.room}`,
                type: s.type,
            }));
            return {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: 'student',
                matricule: student.matricule,
                group: student.groupName,
                year: student.yearLabel ?? `${student.level} ${student.speciality}`,
                level: student.level,
                displayDepartment: student.displayDepartment,
                gpa: student.average,
                absences: student.absencesByModuleJson ?? {},
                grades: student.gradesJson ?? [],
                schedule,
            };
        }
        if (user.role === 'teacher') {
            const teacher = await this.teachersService.findByUserId(userId);
            if (!teacher) {
                return {
                    id: user.id,
                    name: user.fullName,
                    email: user.email,
                    role: 'teacher',
                    department: '',
                    subjects: [],
                    groups: [],
                    hoursPlanned: 0,
                    hoursCompleted: 0,
                    pendingGrades: [],
                };
            }
            return {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: 'teacher',
                department: teacher.department,
                subjects: teacher.subjectsJson ?? [],
                groups: teacher.groupsJson ?? [],
                hoursPlanned: teacher.hoursPlanned,
                hoursCompleted: teacher.hoursCompleted,
                pendingGrades: teacher.pendingGradesJson ?? [],
            };
        }
        if (user.role === 'admin') {
            return {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: 'admin',
                department: user.department ?? '',
                stats: {
                    totalStudents: user.adminStatsJson?.totalStudents ?? 0,
                    activeTeachers: user.adminStatsJson?.activeTeachers ?? 0,
                    pendingValidations: user.adminStatsJson?.pendingValidations ?? 0,
                    avgAttendance: user.adminStatsJson?.avgAttendance ?? 0,
                    publishedResources: user.adminStatsJson?.publishedResources ?? 0,
                },
            };
        }
        return {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: 'dean',
            faculty: user.faculty ?? '',
        };
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