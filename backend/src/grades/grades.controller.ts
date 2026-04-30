import { Controller, Get, Post, Body, Param, Query, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Grades')
@Controller('grades')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all grades' })
  findAll() {
    return this.gradesService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get grades by student ID' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.gradesService.findByStudent(studentId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get grades by teacher ID' })
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.gradesService.findByTeacher(teacherId);
  }

  @Get('teacher/:teacherId/pending')
  @ApiOperation({ summary: 'Get pending grades for a teacher' })
  getPendingGrades(@Param('teacherId') teacherId: string) {
    return this.gradesService.getPendingGrades(teacherId);
  }

  @Get('student/:studentId/gpa')
  @ApiOperation({ summary: 'Calculate GPA for a student' })
  calculateGPA(@Param('studentId') studentId: string) {
    return this.gradesService.calculateGPA(studentId);
  }

  @Get('student/:studentId/semester/:semester')
  @ApiOperation({ summary: 'Get grades by semester' })
  findBySemester(
    @Param('studentId') studentId: string,
    @Param('semester') semester: string,
  ) {
    return this.gradesService.findBySemester(studentId, semester);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get grade by ID' })
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new grade' })
  create(@Body() createData: any) {
    return this.gradesService.create(createData);
  }

  @Put(':id/validate')
  @ApiOperation({ summary: 'Validate a grade' })
  validateGrade(@Param('id') id: string) {
    return this.gradesService.validateGrade(id);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject a grade' })
  rejectGrade(@Param('id') id: string) {
    return this.gradesService.rejectGrade(id);
  }
}