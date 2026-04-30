import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DeanService } from './dean.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dean')
@Controller('dean')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeanController {
  constructor(private readonly deanService: DeanService) {}

  @Get()
  @ApiOperation({ summary: 'Get all deans' })
  findAll() {
    return this.deanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dean by ID' })
  findOne(@Param('id') id: string) {
    return this.deanService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get dean by user ID' })
  findByUserId(@Param('userId') userId: string) {
    return this.deanService.findByUserId(userId);
  }
}