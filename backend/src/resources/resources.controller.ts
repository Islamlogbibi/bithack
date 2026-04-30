import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}
  @Get()
  list() {
    return this.resourcesService.list();
  }
  @Post()
  @Roles('teacher', 'admin')
  create(@Body() body: Record<string, unknown>) {
    return this.resourcesService.create(body);
  }
  @Delete(':id')
  @Roles('teacher', 'admin')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(Number(id));
  }
}
