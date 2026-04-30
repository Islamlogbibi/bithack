import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('student')
  @Roles('student')
  student() {
    return this.dashboardService.student();
  }
  @Get('teacher')
  @Roles('teacher')
  teacher() {
    return this.dashboardService.teacher();
  }
  @Get('admin')
  @Roles('admin')
  admin() {
    return this.dashboardService.admin();
  }
  @Get('dean')
  @Roles('dean')
  dean() {
    return this.dashboardService.dean();
  }
}
