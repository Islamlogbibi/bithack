import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  findAllAdmins() {
    return this.adminService.findAllAdmins();
  }

  @Get('admins/user/:userId')
  @ApiOperation({ summary: 'Get admin by user ID' })
  findAdminByUserId(@Param('userId') userId: string) {
    return this.adminService.findAdminByUserId(userId);
  }

  @Get('deans')
  @ApiOperation({ summary: 'Get all deans' })
  findAllDeans() {
    return this.adminService.findAllDeans();
  }

  @Get('deans/user/:userId')
  @ApiOperation({ summary: 'Get dean by user ID' })
  findDeanByUserId(@Param('userId') userId: string) {
    return this.adminService.findDeanByUserId(userId);
  }
}