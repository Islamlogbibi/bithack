import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity, UserEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService implements OnModuleInit {
  constructor(
    @InjectRepository(MessageEntity) private readonly messagesRepo: Repository<MessageEntity>,
    @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.messagesRepo.count();
    if (count > 0) return;

    const student = await this.usersRepo.findOne({ where: { email: 'student@pui.dz' } });
    const teacher = await this.usersRepo.findOne({ where: { email: 'teacher@pui.dz' } });
    if (!student || !teacher) return;

    await this.messagesRepo.save(
      this.messagesRepo.create([
        {
          conversationId: 't1',
          sender: teacher,
          content: "Bonjour! Bienvenue dans mon cours d'Algorithmique.",
        },
        {
          conversationId: 't1',
          sender: student,
          content: 'Bonjour Professeur! Merci.',
        },
        {
          conversationId: 'group1',
          sender: student,
          content: "Quelqu'un a compris l'exercice 3?",
        },
      ]),
    );
  }
  list(conversationId: string) {
    return this.messagesRepo.find({ where: { conversationId }, order: { sentAt: 'ASC' } });
  }
  async send(payload: { conversationId: string; senderId: number; content: string }) {
    const sender = await this.usersRepo.findOneByOrFail({ id: payload.senderId });
    return this.messagesRepo.save(
      this.messagesRepo.create({ conversationId: payload.conversationId, sender, content: payload.content }),
    );
  }
}
