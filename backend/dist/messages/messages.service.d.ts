import { OnModuleInit } from '@nestjs/common';
import { MessageEntity, UserEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class MessagesService implements OnModuleInit {
    private readonly messagesRepo;
    private readonly usersRepo;
    constructor(messagesRepo: Repository<MessageEntity>, usersRepo: Repository<UserEntity>);
    onModuleInit(): Promise<void>;
    list(conversationId: string): Promise<MessageEntity[]>;
    send(payload: {
        conversationId: string;
        senderId: number;
        content: string;
    }): Promise<MessageEntity>;
}
