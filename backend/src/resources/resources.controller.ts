import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  @Roles('admin', 'dean', 'teacher', 'student')
  list() {
    return this.resourcesService.list();
  }

  @Post()
  @Roles('admin', 'teacher')
  create(@Body() body: any) {
    return this.resourcesService.create(body);
  }

  @Delete(':id')
  @Roles('admin', 'teacher')
  remove(@Param('id') id: string) {
    return this.resourcesService.delete(Number(id));
  }
}
