import { Module } from '@nestjs/common';
import { ValidationsController } from './validations.controller';
import { ValidationsService } from './validations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([ValidationEntity])],
  controllers: [ValidationsController],
  providers: [ValidationsService],
})
export class ValidationsModule {}
