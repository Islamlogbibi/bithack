import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JustificationsService } from './justifications.service';
import { JustificationsController } from './justifications.controller';
import { Justification } from './entities/justification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Justification])],
  providers: [JustificationsService],
  controllers: [JustificationsController],
  exports: [JustificationsService],
})
export class JustificationsModule {}