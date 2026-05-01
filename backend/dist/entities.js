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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleEntity = exports.SpecialityEntity = exports.MessageEntity = exports.AttendanceAlertEntity = exports.ValidationEntity = exports.JustificationEntity = exports.ResourceEntity = exports.TeacherEntity = exports.StudentEntity = exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity {
    id;
    email;
    passwordHash;
    fullName;
    role;
    createdAt;
    updatedAt;
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntity);
let StudentEntity = class StudentEntity {
    id;
    user;
    matricule;
    speciality;
    level;
    section;
    groupName;
    average;
    absences;
};
exports.StudentEntity = StudentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StudentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => UserEntity, { eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", UserEntity)
], StudentEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], StudentEntity.prototype, "matricule", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudentEntity.prototype, "speciality", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudentEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudentEntity.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudentEntity.prototype, "groupName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], StudentEntity.prototype, "average", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], StudentEntity.prototype, "absences", void 0);
exports.StudentEntity = StudentEntity = __decorate([
    (0, typeorm_1.Entity)('students')
], StudentEntity);
let TeacherEntity = class TeacherEntity {
    id;
    user;
    department;
    hoursPlanned;
    hoursCompleted;
};
exports.TeacherEntity = TeacherEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TeacherEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => UserEntity, { eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", UserEntity)
], TeacherEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], TeacherEntity.prototype, "hoursPlanned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], TeacherEntity.prototype, "hoursCompleted", void 0);
exports.TeacherEntity = TeacherEntity = __decorate([
    (0, typeorm_1.Entity)('teachers')
], TeacherEntity);
let ResourceEntity = class ResourceEntity {
    id;
    title;
    subject;
    type;
    fileType;
    teacherName;
    createdAt;
};
exports.ResourceEntity = ResourceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ResourceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResourceEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResourceEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResourceEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResourceEntity.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResourceEntity.prototype, "teacherName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ResourceEntity.prototype, "createdAt", void 0);
exports.ResourceEntity = ResourceEntity = __decorate([
    (0, typeorm_1.Entity)('resources')
], ResourceEntity);
let JustificationEntity = class JustificationEntity {
    id;
    student;
    module;
    fileName;
    status;
    reviewComment;
    submittedAt;
};
exports.JustificationEntity = JustificationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JustificationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => StudentEntity, { eager: true }),
    __metadata("design:type", StudentEntity)
], JustificationEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JustificationEntity.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JustificationEntity.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], JustificationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], JustificationEntity.prototype, "reviewComment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JustificationEntity.prototype, "submittedAt", void 0);
exports.JustificationEntity = JustificationEntity = __decorate([
    (0, typeorm_1.Entity)('justifications')
], JustificationEntity);
let ValidationEntity = class ValidationEntity {
    id;
    teacherName;
    module;
    groupName;
    count;
    status;
    submittedAt;
};
exports.ValidationEntity = ValidationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ValidationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ValidationEntity.prototype, "teacherName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ValidationEntity.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ValidationEntity.prototype, "groupName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ValidationEntity.prototype, "count", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], ValidationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ValidationEntity.prototype, "submittedAt", void 0);
exports.ValidationEntity = ValidationEntity = __decorate([
    (0, typeorm_1.Entity)('validations')
], ValidationEntity);
let AttendanceAlertEntity = class AttendanceAlertEntity {
    id;
    student;
    subject;
    risk;
    status;
};
exports.AttendanceAlertEntity = AttendanceAlertEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AttendanceAlertEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => StudentEntity, { eager: true }),
    __metadata("design:type", StudentEntity)
], AttendanceAlertEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AttendanceAlertEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AttendanceAlertEntity.prototype, "risk", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'open' }),
    __metadata("design:type", String)
], AttendanceAlertEntity.prototype, "status", void 0);
exports.AttendanceAlertEntity = AttendanceAlertEntity = __decorate([
    (0, typeorm_1.Entity)('attendance_alerts')
], AttendanceAlertEntity);
let MessageEntity = class MessageEntity {
    id;
    conversationId;
    sender;
    content;
    sentAt;
};
exports.MessageEntity = MessageEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MessageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity, { eager: true }),
    __metadata("design:type", UserEntity)
], MessageEntity.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], MessageEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MessageEntity.prototype, "sentAt", void 0);
exports.MessageEntity = MessageEntity = __decorate([
    (0, typeorm_1.Entity)('messages')
], MessageEntity);
let SpecialityEntity = class SpecialityEntity {
    id;
    name;
    level;
    section;
    groupName;
};
exports.SpecialityEntity = SpecialityEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SpecialityEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpecialityEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpecialityEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpecialityEntity.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpecialityEntity.prototype, "groupName", void 0);
exports.SpecialityEntity = SpecialityEntity = __decorate([
    (0, typeorm_1.Entity)('specialities'),
    (0, typeorm_1.Unique)(['name', 'level', 'section', 'groupName'])
], SpecialityEntity);
let ScheduleEntity = class ScheduleEntity {
    id;
    day;
    time;
    subject;
    room;
    type;
    scope;
    scopeId;
};
exports.ScheduleEntity = ScheduleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ScheduleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "day", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "scopeId", void 0);
exports.ScheduleEntity = ScheduleEntity = __decorate([
    (0, typeorm_1.Entity)('schedules')
], ScheduleEntity);
//# sourceMappingURL=entities.js.map