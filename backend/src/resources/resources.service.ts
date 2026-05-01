import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceEntity } from '../entities';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly repo: Repository<ResourceEntity>,
  ) {}

  async list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(data: any) {
    const resource = this.repo.create(data);
    return this.repo.save(resource);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
