import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
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

  @Get()
  @Roles('admin', 'dean')
  listAll() {
    return this.schedulesService.listAll();
  }

  @Post()
  @Roles('admin')
  create(@Body() data: any) {
    return this.schedulesService.create(data);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.schedulesService.delete(+id);
  }
}
