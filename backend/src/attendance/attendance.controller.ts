import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('alerts')
  @Roles('admin', 'dean')
  listAlerts() {
    return this.attendanceService.listAlerts();
  }

  @Patch('alerts/:id/dismiss')
  @Roles('admin', 'dean')
  dismiss(@Param('id') id: string) {
    return this.attendanceService.dismissAlert(Number(id));
  }
}
