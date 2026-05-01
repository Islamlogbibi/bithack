import { Module } from '@nestjs/common';
import { ValidationsController } from './validations.controller';
import { ValidationsService } from './validations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationEntity, StudentEntity, GradeEntity, TeacherEntity, UserEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([ValidationEntity, StudentEntity, GradeEntity, TeacherEntity, UserEntity])],
  controllers: [ValidationsController],
  providers: [ValidationsService],
})
export class ValidationsModule {}
