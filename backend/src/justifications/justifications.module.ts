import { Module } from '@nestjs/common';
import { JustificationsController } from './justifications.controller';
import { JustificationsService } from './justifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JustificationEntity, StudentEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([JustificationEntity, StudentEntity])],
  controllers: [JustificationsController],
  providers: [JustificationsService],
})
export class JustificationsModule {}
