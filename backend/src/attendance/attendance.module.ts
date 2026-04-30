import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceAlertEntity, StudentEntity, UserEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceAlertEntity, StudentEntity, UserEntity])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
