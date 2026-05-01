import { Module } from '@nestjs/common';
import { SpecialitiesController } from './specialities.controller';
import { SpecialitiesService } from './specialities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelEntity, SpecialityEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialityEntity, LevelEntity])],
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService],
})
export class SpecialitiesModule {}
