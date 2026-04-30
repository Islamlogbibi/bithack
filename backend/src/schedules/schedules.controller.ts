import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('schedules')
@UseGuards(JwtAuthGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}
  @Get(':scope/:scopeId')
  @Roles('student', 'teacher', 'admin', 'dean')
  byScope(@Param('scope') scope: string, @Param('scopeId') scopeId: string) {
    return this.schedulesService.byScope(scope, scopeId);
  }
}
