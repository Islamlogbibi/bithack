import { Repository } from 'typeorm';
import { MessageEntity, UserEntity } from '../entities';
export declare class MessagesService {
    private readonly repo;
    private readonly userRepo;
    constructor(repo: Repository<MessageEntity>, userRepo: Repository<UserEntity>);
    list(conversationId: string): Promise<MessageEntity[]>;
    send(data: {
        conversationId: string;
        senderId: number;
        content: string;
    }): Promise<MessageEntity | undefined>;
}
