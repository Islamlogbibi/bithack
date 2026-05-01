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
exports.AssignmentSubmissionEntity = exports.AssignmentEntity = exports.ReferenceBlobEntity = exports.AttendanceAlertEntity = exports.MessageEntity = exports.JustificationEntity = exports.ResourceEntity = exports.ValidationEntity = exports.TeacherModuleEntity = exports.TeacherSpecialityEntity = exports.CVAcademiqueEntity = exports.PresenceEntity = exports.GradeEntity = exports.ScheduleEntity = exports.CourseEntity = exports.TeacherEntity = exports.StudentEntity = exports.GroupEntity = exports.SectionEntity = exports.LevelEntity = exports.SpecialityEntity = exports.DepartmentEntity = exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity {
    id;
    email;
    fullName;
    passwordHash;
    role;
    department;
    faculty;
    adminStatsJson;
    student;
    teacher;
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
], UserEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "faculty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "adminStatsJson", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('StudentEntity', 'user', { cascade: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('TeacherEntity', 'user', { cascade: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "teacher", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntity);
let DepartmentEntity = class DepartmentEntity {
    id;
    libelle;
    code;
    specialities;
    teachers;
    chef;
};
exports.DepartmentEntity = DepartmentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DepartmentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DepartmentEntity.prototype, "libelle", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], DepartmentEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('SpecialityEntity', 'department'),
    __metadata("design:type", Array)
], DepartmentEntity.prototype, "specialities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('TeacherEntity', 'department'),
    __metadata("design:type", Array)
], DepartmentEntity.prototype, "teachers", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('TeacherEntity'),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], DepartmentEntity.prototype, "chef", void 0);
exports.DepartmentEntity = DepartmentEntity = __decorate([
    (0, typeorm_1.Entity)('departments')
], DepartmentEntity);
let SpecialityEntity = class SpecialityEntity {
    id;
    code;
    libelle;
    name;
    level;
    section;
    groupName;
    department;
    levels;
};
exports.SpecialityEntity = SpecialityEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SpecialityEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpecialityEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpecialityEntity.prototype, "libelle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SpecialityEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SpecialityEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SpecialityEntity.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SpecialityEntity.prototype, "groupName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('DepartmentEntity', 'specialities'),
    __metadata("design:type", Object)
], SpecialityEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('LevelEntity', 'speciality'),
    __metadata("design:type", Array)
], SpecialityEntity.prototype, "levels", void 0);
exports.SpecialityEntity = SpecialityEntity = __decorate([
    (0, typeorm_1.Entity)('specialities')
], SpecialityEntity);
let LevelEntity = class LevelEntity {
    id;
    code;
    libelle;
    speciality;
    sections;
};
exports.LevelEntity = LevelEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LevelEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LevelEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LevelEntity.prototype, "libelle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('SpecialityEntity', 'levels'),
    __metadata("design:type", Object)
], LevelEntity.prototype, "speciality", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('SectionEntity', 'level'),
    __metadata("design:type", Array)
], LevelEntity.prototype, "sections", void 0);
exports.LevelEntity = LevelEntity = __decorate([
    (0, typeorm_1.Entity)('levels')
], LevelEntity);
let SectionEntity = class SectionEntity {
    id;
    code;
    level;
    groups;
};
exports.SectionEntity = SectionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SectionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SectionEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('LevelEntity', 'sections'),
    __metadata("design:type", Object)
], SectionEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('GroupEntity', 'section'),
    __metadata("design:type", Array)
], SectionEntity.prototype, "groups", void 0);
exports.SectionEntity = SectionEntity = __decorate([
    (0, typeorm_1.Entity)('sections')
], SectionEntity);
let GroupEntity = class GroupEntity {
    id;
    code;
    type;
    section;
};
exports.GroupEntity = GroupEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GroupEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('SectionEntity', 'groups'),
    __metadata("design:type", Object)
], GroupEntity.prototype, "section", void 0);
exports.GroupEntity = GroupEntity = __decorate([
    (0, typeorm_1.Entity)('groups')
], GroupEntity);
let StudentEntity = class StudentEntity {
    id;
    user;
    nom;
    prenom;
    numCarte;
    matricule;
    gradesJson;
    speciality;
    level;
    section;
    group;
    average;
    grades;
    presences;
};
exports.StudentEntity = StudentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StudentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('UserEntity', 'student'),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], StudentEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StudentEntity.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StudentEntity.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], StudentEntity.prototype, "numCarte", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], StudentEntity.prototype, "matricule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], StudentEntity.prototype, "gradesJson", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('SpecialityEntity'),
    __metadata("design:type", Object)
], StudentEntity.prototype, "speciality", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('LevelEntity'),
    __metadata("design:type", Object)
], StudentEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('SectionEntity'),
    __metadata("design:type", Object)
], StudentEntity.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('GroupEntity'),
    __metadata("design:type", Object)
], StudentEntity.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], StudentEntity.prototype, "average", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('GradeEntity', 'student'),
    __metadata("design:type", Array)
], StudentEntity.prototype, "grades", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('PresenceEntity', 'student'),
    __metadata("design:type", Array)
], StudentEntity.prototype, "presences", void 0);
exports.StudentEntity = StudentEntity = __decorate([
    (0, typeorm_1.Entity)('students')
], StudentEntity);
let TeacherEntity = class TeacherEntity {
    id;
    user;
    department;
    nom;
    prenom;
    orcid;
    scopusId;
    hoursPlanned;
    hoursCompleted;
    academicCvJson;
    subjectsJson;
    groupsJson;
    courses;
    modules;
    cv;
};
exports.TeacherEntity = TeacherEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TeacherEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('UserEntity', 'teacher'),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], TeacherEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('DepartmentEntity', 'teachers'),
    __metadata("design:type", Object)
], TeacherEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TeacherEntity.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TeacherEntity.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TeacherEntity.prototype, "orcid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TeacherEntity.prototype, "scopusId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], TeacherEntity.prototype, "hoursPlanned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], TeacherEntity.prototype, "hoursCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TeacherEntity.prototype, "academicCvJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TeacherEntity.prototype, "subjectsJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TeacherEntity.prototype, "groupsJson", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('CourseEntity', 'teacher'),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "courses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('TeacherModuleEntity', 'teacher'),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "modules", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('CVAcademiqueEntity', 'teacher'),
    __metadata("design:type", Object)
], TeacherEntity.prototype, "cv", void 0);
exports.TeacherEntity = TeacherEntity = __decorate([
    (0, typeorm_1.Entity)('teachers')
], TeacherEntity);
let CourseEntity = class CourseEntity {
    id;
    intitule;
    codeCours;
    credits;
    type;
    teacher;
    speciality;
    level;
};
exports.CourseEntity = CourseEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CourseEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseEntity.prototype, "intitule", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseEntity.prototype, "codeCours", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CourseEntity.prototype, "credits", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('TeacherEntity', 'courses'),
    __metadata("design:type", Object)
], CourseEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('SpecialityEntity'),
    __metadata("design:type", Object)
], CourseEntity.prototype, "speciality", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('LevelEntity'),
    __metadata("design:type", Object)
], CourseEntity.prototype, "level", void 0);
exports.CourseEntity = CourseEntity = __decorate([
    (0, typeorm_1.Entity)('courses')
], CourseEntity);
let ScheduleEntity = class ScheduleEntity {
    id;
    dateSeance;
    heureDebut;
    heureFin;
    salle;
    day;
    timeSlot;
    subject;
    sessionType;
    room;
    codeQr;
    course;
    teacher;
    section;
    group;
    groupName;
    level;
    speciality;
};
exports.ScheduleEntity = ScheduleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ScheduleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], ScheduleEntity.prototype, "dateSeance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "heureDebut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "heureFin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "salle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "day", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "timeSlot", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "sessionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "codeQr", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('CourseEntity'),
    __metadata("design:type", Object)
], ScheduleEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('TeacherEntity', { nullable: true }),
    __metadata("design:type", Object)
], ScheduleEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('SectionEntity'),
    __metadata("design:type", Object)
], ScheduleEntity.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('GroupEntity'),
    __metadata("design:type", Object)
], ScheduleEntity.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "groupName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('LevelEntity'),
    __metadata("design:type", Object)
], ScheduleEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('SpecialityEntity'),
    __metadata("design:type", Object)
], ScheduleEntity.prototype, "speciality", void 0);
exports.ScheduleEntity = ScheduleEntity = __decorate([
    (0, typeorm_1.Entity)('schedules')
], ScheduleEntity);
let GradeEntity = class GradeEntity {
    id;
    valeur;
    session;
    statut;
    subject;
    tdGrade;
    examGrade;
    finalGrade;
    credits;
    status;
    semester;
    dateSaisie;
    dateValidation;
    student;
    course;
    teacher;
    validation;
};
exports.GradeEntity = GradeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GradeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], GradeEntity.prototype, "valeur", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GradeEntity.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GradeEntity.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GradeEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], GradeEntity.prototype, "tdGrade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], GradeEntity.prototype, "examGrade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], GradeEntity.prototype, "finalGrade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], GradeEntity.prototype, "credits", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GradeEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GradeEntity.prototype, "semester", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GradeEntity.prototype, "dateSaisie", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], GradeEntity.prototype, "dateValidation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('StudentEntity', 'grades'),
    __metadata("design:type", Object)
], GradeEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('CourseEntity'),
    __metadata("design:type", Object)
], GradeEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('TeacherEntity'),
    __metadata("design:type", Object)
], GradeEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('ValidationEntity', 'grades', { nullable: true }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "validation", void 0);
exports.GradeEntity = GradeEntity = __decorate([
    (0, typeorm_1.Entity)('grades')
], GradeEntity);
let PresenceEntity = class PresenceEntity {
    id;
    horodatage;
    methode;
    student;
    schedule;
};
exports.PresenceEntity = PresenceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PresenceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PresenceEntity.prototype, "horodatage", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PresenceEntity.prototype, "methode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('StudentEntity', 'presences'),
    __metadata("design:type", Object)
], PresenceEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('ScheduleEntity'),
    __metadata("design:type", Object)
], PresenceEntity.prototype, "schedule", void 0);
exports.PresenceEntity = PresenceEntity = __decorate([
    (0, typeorm_1.Entity)('presences')
], PresenceEntity);
let CVAcademiqueEntity = class CVAcademiqueEntity {
    id;
    orcid;
    dateSync;
    teacher;
};
exports.CVAcademiqueEntity = CVAcademiqueEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CVAcademiqueEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CVAcademiqueEntity.prototype, "orcid", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CVAcademiqueEntity.prototype, "dateSync", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('TeacherEntity', 'cv'),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], CVAcademiqueEntity.prototype, "teacher", void 0);
exports.CVAcademiqueEntity = CVAcademiqueEntity = __decorate([
    (0, typeorm_1.Entity)('cv_academique')
], CVAcademiqueEntity);
let TeacherSpecialityEntity = class TeacherSpecialityEntity {
    id;
    teacher;
    speciality;
    level;
};
exports.TeacherSpecialityEntity = TeacherSpecialityEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TeacherSpecialityEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('TeacherEntity'),
    __metadata("design:type", Object)
], TeacherSpecialityEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('SpecialityEntity'),
    __metadata("design:type", Object)
], TeacherSpecialityEntity.prototype, "speciality", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('LevelEntity'),
    __metadata("design:type", Object)
], TeacherSpecialityEntity.prototype, "level", void 0);
exports.TeacherSpecialityEntity = TeacherSpecialityEntity = __decorate([
    (0, typeorm_1.Entity)('teacher_speciality')
], TeacherSpecialityEntity);
let TeacherModuleEntity = class TeacherModuleEntity {
    id;
    teacher;
    subject;
    groupName;
};
exports.TeacherModuleEntity = TeacherModuleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TeacherModuleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('TeacherEntity', 'modules'),
    __metadata("design:type", Object)
], TeacherModuleEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherModuleEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherModuleEntity.prototype, "groupName", void 0);
exports.TeacherModuleEntity = TeacherModuleEntity = __decorate([
    (0, typeorm_1.Entity)('teacher_modules'),
    (0, typeorm_1.Unique)(['teacher', 'subject', 'groupName'])
], TeacherModuleEntity);
let ValidationEntity = class ValidationEntity {
    id;
    teacher;
    course;
    group;
    subject;
    groupName;
    studentGradesJson;
    status;
    submittedAt;
    reviewedAt;
    reviewedBy;
    grades;
};
exports.ValidationEntity = ValidationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ValidationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('TeacherEntity'),
    __metadata("design:type", Object)
], ValidationEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('CourseEntity'),
    __metadata("design:type", Object)
], ValidationEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('GroupEntity'),
    __metadata("design:type", Object)
], ValidationEntity.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ValidationEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ValidationEntity.prototype, "groupName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ValidationEntity.prototype, "studentGradesJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], ValidationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ValidationEntity.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ValidationEntity.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('UserEntity', { nullable: true }),
    __metadata("design:type", Object)
], ValidationEntity.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('GradeEntity', 'validation'),
    __metadata("design:type", Array)
], ValidationEntity.prototype, "grades", void 0);
exports.ValidationEntity = ValidationEntity = __decorate([
    (0, typeorm_1.Entity)('validations')
], ValidationEntity);
let ResourceEntity = class ResourceEntity {
    id;
    title;
    course;
    type;
    date;
    size;
    url;
    group;
    subject;
    fileType;
    teacherName;
    sizeLabel;
    isNew;
    fileContent;
    groupsJson;
    specialityName;
    levelName;
    sectionName;
    groupName;
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
    (0, typeorm_1.ManyToOne)('CourseEntity'),
    __metadata("design:type", Object)
], ResourceEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('GroupEntity'),
    __metadata("design:type", Object)
], ResourceEntity.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "teacherName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "sizeLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ResourceEntity.prototype, "isNew", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "fileContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ResourceEntity.prototype, "groupsJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "specialityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "levelName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "sectionName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourceEntity.prototype, "groupName", void 0);
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
    course;
    module;
    status;
    fileName;
    fileContent;
    absenceDate;
    reviewComment;
    submittedAt;
};
exports.JustificationEntity = JustificationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JustificationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('StudentEntity'),
    __metadata("design:type", Object)
], JustificationEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('CourseEntity'),
    __metadata("design:type", Object)
], JustificationEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JustificationEntity.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], JustificationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JustificationEntity.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], JustificationEntity.prototype, "fileContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JustificationEntity.prototype, "absenceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JustificationEntity.prototype, "reviewComment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JustificationEntity.prototype, "submittedAt", void 0);
exports.JustificationEntity = JustificationEntity = __decorate([
    (0, typeorm_1.Entity)('justifications')
], JustificationEntity);
let MessageEntity = class MessageEntity {
    id;
    conversationId;
    sender;
    content;
    timestamp;
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
    (0, typeorm_1.ManyToOne)('UserEntity'),
    __metadata("design:type", Object)
], MessageEntity.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MessageEntity.prototype, "timestamp", void 0);
exports.MessageEntity = MessageEntity = __decorate([
    (0, typeorm_1.Entity)('messages')
], MessageEntity);
let AttendanceAlertEntity = class AttendanceAlertEntity {
    id;
    student;
    course;
    module;
    absences;
    severity;
    dismissed;
    status;
    createdAt;
};
exports.AttendanceAlertEntity = AttendanceAlertEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AttendanceAlertEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('StudentEntity'),
    __metadata("design:type", Object)
], AttendanceAlertEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('CourseEntity'),
    __metadata("design:type", Object)
], AttendanceAlertEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AttendanceAlertEntity.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AttendanceAlertEntity.prototype, "absences", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AttendanceAlertEntity.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AttendanceAlertEntity.prototype, "dismissed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], AttendanceAlertEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AttendanceAlertEntity.prototype, "createdAt", void 0);
exports.AttendanceAlertEntity = AttendanceAlertEntity = __decorate([
    (0, typeorm_1.Entity)('attendance_alerts')
], AttendanceAlertEntity);
let ReferenceBlobEntity = class ReferenceBlobEntity {
    id;
    key;
    data;
};
exports.ReferenceBlobEntity = ReferenceBlobEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReferenceBlobEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], ReferenceBlobEntity.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], ReferenceBlobEntity.prototype, "data", void 0);
exports.ReferenceBlobEntity = ReferenceBlobEntity = __decorate([
    (0, typeorm_1.Entity)('reference_blobs')
], ReferenceBlobEntity);
let AssignmentEntity = class AssignmentEntity {
    id;
    title;
    course;
    dueDate;
    description;
    groups;
    teacher;
    teacherName;
    createdAt;
};
exports.AssignmentEntity = AssignmentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssignmentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('CourseEntity'),
    __metadata("design:type", Object)
], AssignmentEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)('GroupEntity'),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], AssignmentEntity.prototype, "groups", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('TeacherEntity'),
    __metadata("design:type", Object)
], AssignmentEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "teacherName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssignmentEntity.prototype, "createdAt", void 0);
exports.AssignmentEntity = AssignmentEntity = __decorate([
    (0, typeorm_1.Entity)('assignments')
], AssignmentEntity);
let AssignmentSubmissionEntity = class AssignmentSubmissionEntity {
    id;
    assignment;
    student;
    studentId;
    studentName;
    fileName;
    fileContent;
    submittedAt;
};
exports.AssignmentSubmissionEntity = AssignmentSubmissionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssignmentSubmissionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('AssignmentEntity'),
    __metadata("design:type", Object)
], AssignmentSubmissionEntity.prototype, "assignment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('StudentEntity'),
    __metadata("design:type", Object)
], AssignmentSubmissionEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssignmentSubmissionEntity.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AssignmentSubmissionEntity.prototype, "studentName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssignmentSubmissionEntity.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AssignmentSubmissionEntity.prototype, "fileContent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssignmentSubmissionEntity.prototype, "submittedAt", void 0);
exports.AssignmentSubmissionEntity = AssignmentSubmissionEntity = __decorate([
    (0, typeorm_1.Entity)('assignment_submissions')
], AssignmentSubmissionEntity);
//# sourceMappingURL=entities.js.map