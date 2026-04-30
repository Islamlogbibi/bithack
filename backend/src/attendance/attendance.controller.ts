import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all attendance records' })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get attendance by student ID' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.findByStudent(studentId);
  }

  @Get('schedule/:scheduleId')
  @ApiOperation({ summary: 'Get attendance by schedule ID' })
  findBySchedule(@Param('scheduleId') scheduleId: string) {
    return this.attendanceService.findBySchedule(scheduleId);
  }

  @Get('student/:studentId/stats')
  @ApiOperation({ summary: 'Get attendance statistics for a student' })
  getStudentStats(@Param('studentId') studentId: string) {
    return this.attendanceService.getStudentStats(studentId);
  }

  @Post('qr/generate')
  @ApiOperation({ summary: 'Generate QR code for attendance' })
  generateQR(@Body() body: { scheduleId: string }) {
    return this.attendanceService.generateQRCode(body.scheduleId);
  }

  @Post('scan')
  @ApiOperation({ summary: 'Record attendance from QR scan' })
  recordAttendance(@Body() body: { studentId: string; scheduleId: string; qrCode: string }) {
    return this.attendanceService.recordAttendance(
      body.studentId,
      body.scheduleId,
      body.qrCode,
    );
  }

  @Post(':id/justify')
  @ApiOperation({ summary: 'Justify an absence' })
  justifyAbsence(@Param('id') id: string, @Body() body: { notes: string }) {
    return this.attendanceService.justifyAbsence(id, body.notes);
  }
}