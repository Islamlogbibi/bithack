import { Controller, Get, UseGuards } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('specialities')
@UseGuards(JwtAuthGuard)
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) {}
  @Get('tree')
  @Roles('admin', 'dean')
  getTree() {
    return this.specialitiesService.getTree();
  }
}
