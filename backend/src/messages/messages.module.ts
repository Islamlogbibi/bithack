import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity, UserEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, UserEntity])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
