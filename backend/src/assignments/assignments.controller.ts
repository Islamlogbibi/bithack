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
    const groupsArray = groups ? groups.split(',') : undefined;
    return this.assignmentsService.list(groupsArray);
  }

  @Get('teacher/:name')
  @Roles('teacher')
  findByTeacher(@Param('name') name: string) {
    return this.assignmentsService.findByTeacher(name);
  }

  @Post()
  @Roles('teacher')
  create(@Body() body: any) {
    return this.assignmentsService.createAssignment(body);
  }

  @Post('submit')
  @Roles('student')
  submit(@Body() body: any) {
    return this.assignmentsService.submitWork(body);
  }

  @Get(':id/submissions')
  @Roles('teacher')
  getSubmissions(@Param('id') id: string) {
    return this.assignmentsService.getSubmissions(Number(id));
  }
}
