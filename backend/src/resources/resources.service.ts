import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepo: Repository<ResourceEntity>,
  ) {}
  list() {
    return this.resourceRepo.find({ order: { createdAt: 'DESC' } });
  }
  create(payload: Partial<ResourceEntity>) {
    return this.resourceRepo.save(this.resourceRepo.create(payload));
  }
  remove(id: number) {
    return this.resourceRepo.delete(id);
  }
}
