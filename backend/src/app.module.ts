import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ResourcesModule } from './resources/resources.module';
import { JustificationsModule } from './justifications/justifications.module';
import { ValidationsModule } from './validations/validations.module';
import { AttendanceModule } from './attendance/attendance.module';
import { MessagesModule } from './messages/messages.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SpecialitiesModule } from './specialities/specialities.module';
import { SchedulesModule } from './schedules/schedules.module';
import { ReferenceModule } from './reference/reference.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AttendanceAlertEntity,
  JustificationEntity,
  MessageEntity,
  ResourceEntity,
  ScheduleEntity,
  SpecialityEntity,
  StudentEntity,
  TeacherEntity,
  UserEntity,
  ValidationEntity,
  ReferenceBlobEntity,
  AssignmentEntity,
  AssignmentSubmissionEntity,
  GradeEntity,
  PresenceEntity,
  DepartmentEntity,
  LevelEntity,
  SectionEntity,
  GroupEntity,
  CourseEntity,
  CVAcademiqueEntity,
  TeacherSpecialityEntity,
  TeacherModuleEntity,
} from './entities';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 5432)),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'bithack'),
        extra: {
          connectionTimeoutMillis: Number(
            configService.get('DB_CONNECTION_TIMEOUT_MS', 10000),
          ),
        },
        entities: [
          UserEntity,
          StudentEntity,
          TeacherEntity,
          GradeEntity,
          PresenceEntity,
          DepartmentEntity,
          SpecialityEntity,
          LevelEntity,
          SectionEntity,
          GroupEntity,
          CourseEntity,
          CVAcademiqueEntity,
          TeacherSpecialityEntity,
          TeacherModuleEntity,
          ResourceEntity,
          JustificationEntity,
          ValidationEntity,
          AttendanceAlertEntity,
          MessageEntity,
          ScheduleEntity,
          ReferenceBlobEntity,
          AssignmentEntity,
          AssignmentSubmissionEntity,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    ResourcesModule,
    JustificationsModule,
    ValidationsModule,
    AttendanceModule,
    MessagesModule,
    DashboardModule,
    SpecialitiesModule,
    SchedulesModule,
    ReferenceModule,
    AssignmentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
