import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Get()
  @Roles('student', 'teacher', 'admin', 'dean')
  list(@Query('conversationId') conversationId: string) {
    return this.messagesService.list(conversationId);
  }
  @Post()
  @Roles('student', 'teacher')
  send(@Body() body: { conversationId: string; senderId: number; content: string }) {
    return this.messagesService.send(body);
  }
}
