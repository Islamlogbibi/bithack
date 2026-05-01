import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherEntity, UserEntity, TeacherModuleEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherEntity, UserEntity, TeacherModuleEntity])],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
