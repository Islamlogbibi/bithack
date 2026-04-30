import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeanService } from './dean.service';
import { DeanController } from './dean.controller';
import { Dean } from '../admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dean])],
  providers: [DeanService],
  controllers: [DeanController],
  exports: [DeanService],
})
export class DeanModule {}