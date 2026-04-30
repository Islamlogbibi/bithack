import { Controller, Get, Post, Body, Param, Query, UseGuards, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Schedule')
@Controller('schedule')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all schedules' })
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get schedule by teacher ID' })
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.scheduleService.findByTeacher(teacherId);
  }

  @Get('teacher/:teacherId/weekly')
  @ApiOperation({ summary: 'Get weekly schedule for a teacher' })
  getTeacherWeeklySchedule(@Param('teacherId') teacherId: string) {
    return this.scheduleService.getTeacherWeeklySchedule(teacherId);
  }

  @Get('level/:level')
  @ApiOperation({ summary: 'Get schedule by level' })
  findByLevel(@Param('level') level: string) {
    return this.scheduleService.findByLevel(level);
  }

  @Get('level/:level/section/:section')
  @ApiOperation({ summary: 'Get schedule for level and section' })
  getLevelSchedule(
    @Param('level') level: string,
    @Param('section') section: string,
    @Query('group') group?: string,
  ) {
    return this.scheduleService.getLevelSchedule(level, section, group);
  }

  @Get('day/:day')
  @ApiOperation({ summary: 'Get schedule by day of week' })
  findByDay(@Param('day') day: string) {
    return this.scheduleService.findByDay(parseInt(day));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new schedule' })
  create(@Body() createData: any) {
    return this.scheduleService.create(createData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a schedule' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.scheduleService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule' })
  delete(@Param('id') id: string) {
    return this.scheduleService.delete(id);
  }
}