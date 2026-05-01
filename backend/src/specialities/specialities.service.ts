import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelEntity, SpecialityEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialitiesService {
  constructor(
    @InjectRepository(SpecialityEntity) private readonly repo: Repository<SpecialityEntity>,
    @InjectRepository(LevelEntity) private readonly levelRepo: Repository<LevelEntity>,
  ) {}

  async list() {
    return this.repo.find();
  }

  async getTree() {
    const levels = await this.levelRepo.find({
      relations: ['speciality', 'sections', 'sections.groups'],
      order: {
        speciality: { libelle: 'ASC' },
        libelle: 'ASC',
        sections: { code: 'ASC', groups: { code: 'ASC' } },
      },
    });

    const tree = new Map<string, any>();

    for (const level of levels) {
      const specialityName = level.speciality?.libelle || level.speciality?.name || 'Unknown';
      if (!tree.has(specialityName)) {
        tree.set(specialityName, { speciality: specialityName, levels: [] as any[] });
      }

      const specialityNode = tree.get(specialityName);
      specialityNode.levels.push({
        level: level.libelle,
        sections: (level.sections || []).map((section) => ({
          section: section.code,
          groups: (section.groups || []).map((group: { code: string }) => ({
            group: group.code,
            students: [],
            modules: [],
            teachers: [],
          })),
        })),
      });
    }

    return Array.from(tree.values());
  }
}
