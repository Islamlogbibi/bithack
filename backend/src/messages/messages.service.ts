import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity, UserEntity } from '../entities';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly repo: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async list(conversationId: string) {
    return this.repo.find({
      where: { conversationId },
      relations: ['sender'],
      order: { timestamp: 'ASC' },
    });
  }

  async send(data: { conversationId: string; senderId: number; content: string }) {
    const sender = await this.userRepo.findOne({ where: { id: data.senderId } });
    if (!sender) return;

    const message = this.repo.create({
      conversationId: data.conversationId,
      sender,
      content: data.content,
    });
    return this.repo.save(message);
  }
}
