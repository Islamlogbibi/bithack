import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Alerts')
@Controller('alerts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alerts' })
  findAll() {
    return this.alertsService.findAll();
  }

  @Get('unread/:targetRole')
  @ApiOperation({ summary: 'Get unread alerts by role' })
  findUnread(@Param('targetRole') targetRole: string) {
    return this.alertsService.findUnread(targetRole);
  }

  @Get('unread-count/:targetRole')
  @ApiOperation({ summary: 'Get unread alert count' })
  getUnreadCount(@Param('targetRole') targetRole: string) {
    return this.alertsService.getUnreadCount(targetRole);
  }

  @Get('role/:targetRole')
  @ApiOperation({ summary: 'Get alerts by target role' })
  findByTargetRole(@Param('targetRole') targetRole: string) {
    return this.alertsService.findByTargetRole(targetRole);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get alerts by student ID' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.alertsService.findByStudent(studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get alert by ID' })
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new alert' })
  create(@Body() createData: any) {
    return this.alertsService.create(createData);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark alert as read' })
  markAsRead(@Param('id') id: string) {
    return this.alertsService.markAsRead(id);
  }

  @Put('read-all/:targetRole')
  @ApiOperation({ summary: 'Mark all alerts as read for a role' })
  markAllAsRead(@Param('targetRole') targetRole: string) {
    return this.alertsService.markAllAsRead(targetRole);
  }

  @Put(':id/resolve')
  @ApiOperation({ summary: 'Resolve an alert' })
  resolve(@Param('id') id: string) {
    return this.alertsService.resolve(id);
  }
}