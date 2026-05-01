import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JustificationsService } from './justifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('justifications')
@UseGuards(JwtAuthGuard)
export class JustificationsController {
  constructor(private readonly justificationsService: JustificationsService) {}
  @Get()
  @Roles('student', 'admin', 'dean')
  list() {
    return this.justificationsService.list();
  }
  @Post()
  @Roles('student')
  create(@Body() body: { studentId: number; module: string; fileName: string; fileContent?: string; absenceDate: string; absenceDay: string; absenceTime: string }) {
    return this.justificationsService.create(body.studentId, body.module, body.fileName, body.fileContent, {
      absenceDate: body.absenceDate,
      absenceDay: body.absenceDay,
      absenceTime: body.absenceTime,
    });
  }
  @Post(':id/review')
  @Roles('admin', 'dean')
  review(@Param('id') id: string, @Body() body: { status: 'approved' | 'rejected'; reviewComment?: string }) {
    return this.justificationsService.review(Number(id), body.status, body.reviewComment);
  }
}
