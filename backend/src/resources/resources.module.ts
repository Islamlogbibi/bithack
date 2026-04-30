import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceEntity])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
