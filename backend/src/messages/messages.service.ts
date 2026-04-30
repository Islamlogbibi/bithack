import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageStatus } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
    
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    
    return message;
  }

  async findByReceiver(receiverId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { receiverId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySender(senderId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { senderId },
      relations: ['receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUnread(receiverId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { receiverId, status: MessageStatus.UNREAD },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createData: Partial<Message>): Promise<Message> {
    const message = this.messageRepository.create(createData);
    return this.messageRepository.save(message);
  }

  async markAsRead(id: string): Promise<Message> {
    const message = await this.findOne(id);
    message.status = MessageStatus.READ;
    return this.messageRepository.save(message);
  }

  async archive(id: string): Promise<Message> {
    const message = await this.findOne(id);
    message.status = MessageStatus.ARCHIVED;
    return this.messageRepository.save(message);
  }

  async delete(id: string): Promise<void> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
  }

  async getUnreadCount(receiverId: string): Promise<number> {
    return this.messageRepository.count({
      where: { receiverId, status: MessageStatus.UNREAD },
    });
  }
}