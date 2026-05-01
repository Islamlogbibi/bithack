import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialityEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialitiesService implements OnModuleInit {
  constructor(@InjectRepository(SpecialityEntity) private readonly repo: Repository<SpecialityEntity>) {}

  async onModuleInit() {
    const rows = [
      { name: 'Informatique', level: 'L2', section: 'A', groupName: 'G1' },
      { name: 'Informatique', level: 'L2', section: 'A', groupName: 'G2' },
      { name: 'Informatique', level: 'L3', section: 'A', groupName: 'G1' },
      { name: 'Informatique', level: 'L3', section: 'A', groupName: 'G2' },
      { name: 'Informatique', level: 'L3', section: 'B', groupName: 'G3' },
    ];
    for (const row of rows) {
      const exists = await this.repo.exist({ where: row });
      if (!exists) await this.repo.save(this.repo.create(row));
    }
  }

  async list() {
    return this.repo.find();
  }

  async getTree() {
    const specialities = await this.repo.find();
    // In a real app, we would fetch students and teachers linked to these specialities.
    // For now, we will return the flat list, but formatted for the frontend to digest.
    // However, the frontend expects: { speciality, levels: [{ level, sections: [...] }] }
    
    const treeMap: Record<string, any> = {};

    specialities.forEach(s => {
      if (!treeMap[s.name]) {
        treeMap[s.name] = { speciality: s.name, levels: [] };
      }
      
      let levelObj = treeMap[s.name].levels.find((l: any) => l.level === s.level);
      if (!levelObj) {
        levelObj = { level: s.level, sections: [] };
        treeMap[s.name].levels.push(levelObj);
      }

      let sectionObj = levelObj.sections.find((sec: any) => sec.section === s.section);
      if (!sectionObj) {
        sectionObj = { section: s.section, groups: [] };
        levelObj.sections.push(sectionObj);
      }

      sectionObj.groups.push({
        group: s.groupName,
        students: [], // To be populated if needed
        modules: ['Algorithmique', 'Bases de Données', 'Réseaux'], // Mocked for now
        teachers: ['Dr. Meziani', 'Dr. Bakri', 'Mme. Sarah'] // Mocked for now
      });
    });

    return Object.values(treeMap);
  }
}
