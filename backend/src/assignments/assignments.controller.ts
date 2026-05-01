import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @Roles('student', 'teacher', 'admin')
  list(@Query('groups') groups?: string) {
    const groupList = groups ? groups.split(',') : undefined;
    return this.assignmentsService.list(groupList);
  }

  @Get('teacher/:name')
  @Roles('teacher', 'admin')
  findByTeacher(@Param('name') name: string) {
    return this.assignmentsService.listByTeacher(name);
  }

  @Post()
  @Roles('teacher', 'admin')
  create(@Body() body: any) {
    return this.assignmentsService.create(body);
  }

  @Post('submit')
  @Roles('student')
  submit(@Body() body: any) {
    return this.assignmentsService.submit(body);
  }

  @Get(':id/submissions')
  @Roles('teacher', 'admin')
  getSubmissions(@Param('id') id: string) {
    return this.assignmentsService.listSubmissions(Number(id));
  }
}
