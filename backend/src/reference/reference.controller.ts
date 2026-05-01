import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reference')
@UseGuards(JwtAuthGuard)
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get(':key')
  @Roles('admin', 'dean', 'student', 'teacher')
  async one(@Param('key') key: string) {
    return this.referenceService.get(key);
  }

  @Post(':key')
  @Roles('admin', 'dean', 'student', 'teacher')
  async save(@Param('key') key: string, @Body() body: any) {
    return this.referenceService.save(key, body);
  }
}
