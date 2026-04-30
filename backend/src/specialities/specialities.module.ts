import { Module } from '@nestjs/common';
import { SpecialitiesController } from './specialities.controller';
import { SpecialitiesService } from './specialities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialityEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialityEntity])],
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService],
})
export class SpecialitiesModule {}
