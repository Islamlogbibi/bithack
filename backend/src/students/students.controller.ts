import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Students')
@Controller('students')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('specialities')
  @ApiOperation({ summary: 'Get all specialities' })
  findAllSpecialities() {
    return this.studentsService.findAllSpecialities();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get student by user ID' })
  findByUserId(@Param('userId') userId: string) {
    return this.studentsService.findByUserId(userId);
  }

  @Post('specialities')
  @ApiOperation({ summary: 'Create a new speciality' })
  createSpeciality(@Body() data: any) {
    return this.studentsService.createSpeciality(data);
  }
}