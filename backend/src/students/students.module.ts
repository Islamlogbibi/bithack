import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  StudentEntity, 
  UserEntity, 
  GradeEntity, 
  PresenceEntity, 
  SpecialityEntity, 
  LevelEntity, 
  SectionEntity, 
  GroupEntity 
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentEntity, 
      UserEntity, 
      GradeEntity, 
      PresenceEntity, 
      SpecialityEntity, 
      LevelEntity, 
      SectionEntity, 
      GroupEntity
    ])
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
