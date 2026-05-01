import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';

class CreateStudentDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
  @IsString()
  matricule: string;
  @IsString()
  speciality: string;
  @IsString()
  level: string;
  @IsString()
  section: string;
  @IsString()
  group: string;
}

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles('admin', 'dean', 'teacher')
  list(@Query() query: Record<string, string | undefined>) {
    return this.studentsService.list(query);
  }

  @Post()
  @Roles('admin')
  create(@Body() body: CreateStudentDto) {
    return this.studentsService.create(body);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(Number(id));
  }
}
