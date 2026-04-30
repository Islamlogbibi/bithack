import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    list(conversationId: string): Promise<import("../entities").MessageEntity[]>;
    send(body: {
        conversationId: string;
        senderId: number;
        content: string;
    }): Promise<import("../entities").MessageEntity>;
}
