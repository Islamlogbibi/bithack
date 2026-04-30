import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ValidationsService } from './validations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('validations')
@UseGuards(JwtAuthGuard)
export class ValidationsController {
  constructor(private readonly validationsService: ValidationsService) {}
  @Get()
  @Roles('admin', 'dean')
  list() {
    return this.validationsService.list();
  }
  @Post(':id/review')
  @Roles('admin')
  review(@Param('id') id: string, @Body() body: { status: 'approved' | 'rejected' }) {
    return this.validationsService.review(Number(id), body.status);
  }
}
