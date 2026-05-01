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

  list() {
    return this.repo.find();
  }
}
