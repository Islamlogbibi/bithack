import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
  @Get('alerts')
  @Roles('admin', 'dean', 'teacher')
  alerts() {
    return this.attendanceService.alerts();
  }
  @Patch('alerts/:id/dismiss')
  @Roles('admin')
  dismiss(@Param('id') id: string) {
    return this.attendanceService.dismiss(Number(id));
  }
}
