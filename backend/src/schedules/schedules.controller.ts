import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('schedules')
@UseGuards(JwtAuthGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get(':scope/:scopeId')
  @Roles('admin', 'dean', 'teacher', 'student')
  getByScope(@Param('scope') scope: string, @Param('scopeId') scopeId: string) {
    return this.schedulesService.getByScope(scope, scopeId);
  }

  @Get()
  @Roles('admin', 'dean')
  listAll() {
    return this.schedulesService.list();
  }

  @Post()
  @Roles('admin')
  create(@Body() body: any) {
    return this.schedulesService.create(body);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.schedulesService.delete(Number(id));
  }
}
