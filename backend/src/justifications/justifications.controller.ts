import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JustificationsService } from './justifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('justifications')
@UseGuards(JwtAuthGuard)
export class JustificationsController {
  constructor(private readonly justificationsService: JustificationsService) {}

  @Get()
  @Roles('admin', 'dean')
  list() {
    return this.justificationsService.list();
  }

  @Post()
  @Roles('student')
  create(@Body() body: any) {
    return this.justificationsService.create(body);
  }

  @Patch(':id/review')
  @Roles('admin', 'dean')
  review(@Param('id') id: string, @Body() body: any) {
    return this.justificationsService.review(Number(id), body);
  }
}
