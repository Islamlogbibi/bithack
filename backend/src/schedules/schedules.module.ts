import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEntity])],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
