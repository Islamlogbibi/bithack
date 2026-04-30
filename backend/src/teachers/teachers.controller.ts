import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Teachers')
@Controller('teachers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get teacher by ID' })
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get teacher by user ID' })
  findByUserId(@Param('userId') userId: string) {
    return this.teachersService.findByUserId(userId);
  }
}