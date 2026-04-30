import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { AdminModule } from './admin/admin.module';
import { DeanModule } from './dean/dean.module';
import { AttendanceModule } from './attendance/attendance.module';
import { GradesModule } from './grades/grades.module';
import { ScheduleModule } from './schedule/schedule.module';
import { JustificationsModule } from './justifications/justifications.module';
import { AlertsModule } from './alerts/alerts.module';
import { MessagesModule } from './messages/messages.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    // Config module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // TypeORM configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'osca'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    
    // Feature modules
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    AdminModule,
    DeanModule,
    AttendanceModule,
    GradesModule,
    ScheduleModule,
    JustificationsModule,
    AlertsModule,
    MessagesModule,
    ResourcesModule,
  ],
})
export class AppModule {}