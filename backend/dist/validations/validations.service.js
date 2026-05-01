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
exports.ValidationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let ValidationsService = class ValidationsService {
    repo;
    gradeRepo;
    studentRepo;
    teacherRepo;
    userRepo;
    constructor(repo, gradeRepo, studentRepo, teacherRepo, userRepo) {
        this.repo = repo;
        this.gradeRepo = gradeRepo;
        this.studentRepo = studentRepo;
        this.teacherRepo = teacherRepo;
        this.userRepo = userRepo;
    }
    async list() {
        const validations = await this.repo.find({
            relations: ['teacher', 'teacher.user', 'grades', 'grades.student', 'grades.student.user'],
            order: { submittedAt: 'DESC' }
        });
        return validations.map(v => ({
            id: v.id,
            teacherName: v.teacher?.user?.fullName || 'Inconnu',
            module: v.subject,
            groupName: v.groupName,
            status: v.status,
            count: (v.studentGradesJson?.length || v.grades?.length || 0),
            submittedAt: v.submittedAt,
            studentGradesJson: Array.isArray(v.studentGradesJson) && v.studentGradesJson.length > 0
                ? v.studentGradesJson
                : (v.grades || []).map(g => ({
                    student: g.student?.user?.fullName || 'Étudiant',
                    matricule: g.student?.matricule,
                    grade: g.examGrade,
                    td: g.tdGrade,
                })),
        }));
    }
    async create(data) {
        const teacher = await this.teacherRepo.findOne({
            where: { user: { fullName: data.teacherName } },
            relations: ['user']
        });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        const validation = await this.repo.save(this.repo.create({
            teacher,
            subject: data.module,
            groupName: data.groupName,
            studentGradesJson: Array.isArray(data.studentGradesJson) ? data.studentGradesJson : [],
            status: 'pending',
        }));
        if (data.studentGradesJson && Array.isArray(data.studentGradesJson)) {
            for (const entry of data.studentGradesJson) {
                const student = await this.studentRepo.findOne({ where: { matricule: entry.matricule } });
                if (student) {
                    const grade = this.gradeRepo.create({
                        student,
                        validation,
                        subject: data.module,
                        tdGrade: entry.td || 10,
                        examGrade: entry.grade || 10,
                        finalGrade: Math.round(((entry.td || 10) * 0.4 + (entry.grade || 10) * 0.6) * 10) / 10,
                        status: 'pending',
                        credits: 3
                    });
                    await this.gradeRepo.save(grade);
                }
            }
        }
        return validation;
    }
    async review(id, status, reviewerId) {
        const validation = await this.repo.findOne({
            where: { id },
            relations: ['grades', 'grades.student']
        });
        if (!validation)
            throw new common_1.NotFoundException('Validation not found');
        validation.status = status;
        validation.reviewedAt = new Date();
        if (reviewerId) {
            const reviewer = await this.userRepo.findOne({ where: { id: reviewerId } });
            if (reviewer)
                validation.reviewedBy = reviewer;
        }
        await this.repo.save(validation);
        if (validation.grades) {
            for (const grade of validation.grades) {
                grade.status = status;
                await this.gradeRepo.save(grade);
                if (status === 'approved' && grade.student) {
                    await this.updateStudentAverage(grade.student.id);
                }
            }
        }
        return { success: true };
    }
    async updateStudentAverage(studentId) {
        const approvedGrades = await this.gradeRepo.find({
            where: { student: { id: studentId }, status: 'approved' }
        });
        if (approvedGrades.length > 0) {
            const sum = approvedGrades.reduce((acc, g) => acc + Number(g.finalGrade), 0);
            const avg = sum / approvedGrades.length;
            await this.studentRepo.update(studentId, { average: Math.round(avg * 100) / 100 });
        }
    }
};
exports.ValidationsService = ValidationsService;
exports.ValidationsService = ValidationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ValidationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.GradeEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.StudentEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.TeacherEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ValidationsService);
//# sourceMappingURL=validations.service.js.map