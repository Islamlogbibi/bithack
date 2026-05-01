"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const students_module_1 = require("./students/students.module");
const teachers_module_1 = require("./teachers/teachers.module");
const resources_module_1 = require("./resources/resources.module");
const justifications_module_1 = require("./justifications/justifications.module");
const validations_module_1 = require("./validations/validations.module");
const attendance_module_1 = require("./attendance/attendance.module");
const messages_module_1 = require("./messages/messages.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const specialities_module_1 = require("./specialities/specialities.module");
const schedules_module_1 = require("./schedules/schedules.module");
const reference_module_1 = require("./reference/reference.module");
const assignments_module_1 = require("./assignments/assignments.module");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const core_1 = require("@nestjs/core");
const roles_guard_1 = require("./auth/roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: Number(configService.get('DB_PORT', 5432)),
                    username: configService.get('DB_USER', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'postgres'),
                    database: configService.get('DB_NAME', 'bithack'),
                    extra: {
                        connectionTimeoutMillis: Number(configService.get('DB_CONNECTION_TIMEOUT_MS', 10000)),
                    },
                    entities: [
                        entities_1.UserEntity,
                        entities_1.StudentEntity,
                        entities_1.TeacherEntity,
                        entities_1.GradeEntity,
                        entities_1.PresenceEntity,
                        entities_1.DepartmentEntity,
                        entities_1.SpecialityEntity,
                        entities_1.LevelEntity,
                        entities_1.SectionEntity,
                        entities_1.GroupEntity,
                        entities_1.CourseEntity,
                        entities_1.CVAcademiqueEntity,
                        entities_1.TeacherSpecialityEntity,
                        entities_1.TeacherModuleEntity,
                        entities_1.ResourceEntity,
                        entities_1.JustificationEntity,
                        entities_1.ValidationEntity,
                        entities_1.AttendanceAlertEntity,
                        entities_1.MessageEntity,
                        entities_1.ScheduleEntity,
                        entities_1.ReferenceBlobEntity,
                        entities_1.AssignmentEntity,
                        entities_1.AssignmentSubmissionEntity,
                    ],
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            resources_module_1.ResourcesModule,
            justifications_module_1.JustificationsModule,
            validations_module_1.ValidationsModule,
            attendance_module_1.AttendanceModule,
            messages_module_1.MessagesModule,
            dashboard_module_1.DashboardModule,
            specialities_module_1.SpecialitiesModule,
            schedules_module_1.SchedulesModule,
            reference_module_1.ReferenceModule,
            assignments_module_1.AssignmentsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map