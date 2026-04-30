import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JustificationsService } from './justifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Justifications')
@Controller('justifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JustificationsController {
  constructor(private readonly justificationsService: JustificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all justifications' })
  findAll() {
    return this.justificationsService.findAll();
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending justifications' })
  findPending() {
    return this.justificationsService.findPending();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get justification statistics' })
  getStats() {
    return this.justificationsService.getStats();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get justifications by student ID' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.justificationsService.findByStudent(studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get justification by ID' })
  findOne(@Param('id') id: string) {
    return this.justificationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new justification' })
  create(@Body() createData: any) {
    return this.justificationsService.create(createData);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve a justification' })
  approve(@Param('id') id: string, @Body() body: { adminComment?: string }) {
    return this.justificationsService.approve(id, body.adminComment);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject a justification' })
  reject(@Param('id') id: string, @Body() body: { adminComment: string }) {
    return this.justificationsService.reject(id, body.adminComment);
  }
}