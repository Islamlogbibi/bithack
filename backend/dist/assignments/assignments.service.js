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
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let AssignmentsService = class AssignmentsService {
    assignmentRepo;
    submissionRepo;
    constructor(assignmentRepo, submissionRepo) {
        this.assignmentRepo = assignmentRepo;
        this.submissionRepo = submissionRepo;
    }
    async list(groups) {
        if (groups && groups.length > 0) {
            return this.assignmentRepo.find({ order: { createdAt: 'DESC' } });
        }
        return this.assignmentRepo.find({ order: { createdAt: 'DESC' } });
    }
    async listByTeacher(teacherName) {
        return this.assignmentRepo.find({
            where: { teacherName },
            order: { createdAt: 'DESC' }
        });
    }
    async create(data) {
        const assignment = this.assignmentRepo.create(data);
        return this.assignmentRepo.save(assignment);
    }
    async submit(data) {
        const assignment = await this.assignmentRepo.findOne({ where: { id: data.assignmentId } });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        const submission = this.submissionRepo.create({
            assignment,
            studentId: data.studentId,
            studentName: data.studentName,
            fileName: data.fileName,
            fileContent: data.fileContent,
        });
        return this.submissionRepo.save(submission);
    }
    async listSubmissions(assignmentId) {
        return this.submissionRepo.find({
            where: { assignment: { id: assignmentId } },
            order: { submittedAt: 'DESC' }
        });
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.AssignmentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.AssignmentSubmissionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map