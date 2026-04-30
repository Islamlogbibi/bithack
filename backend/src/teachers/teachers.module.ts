import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherEntity])],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
