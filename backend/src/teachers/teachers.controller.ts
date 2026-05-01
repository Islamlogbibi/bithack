import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('teachers')
@UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @Roles('admin', 'dean')
  list() {
    return this.teachersService.list();
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() data: { subjectsJson?: string[]; groupsJson?: string[] }) {
    return this.teachersService.update(+id, data);
  }
}
