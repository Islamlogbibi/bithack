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
    const resource = this.repo.create({
      ...data,
      // Backfill legacy DB columns so inserts do not fail.
      date: data.date ?? new Date().toISOString().slice(0, 10),
      size: data.size ?? data.sizeLabel ?? '—',
      url: data.url ?? '#',
      type: data.type ?? 'Cours',
      subject: data.subject ?? '',
      fileType: data.fileType ?? 'PDF',
      teacherName: data.teacherName ?? '',
      sizeLabel: data.sizeLabel ?? data.size ?? '—',
      isNew: Boolean(data.isNew),
      fileContent: data.fileContent ?? null,
      groupsJson: data.groupsJson ?? null,
      specialityName: data.specialityName ?? null,
      levelName: data.levelName ?? null,
      sectionName: data.sectionName ?? null,
      groupName: data.groupName ?? null,
    });
    return this.repo.save(resource);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
