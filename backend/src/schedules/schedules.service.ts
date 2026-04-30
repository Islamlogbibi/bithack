import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulesService implements OnModuleInit {
  constructor(@InjectRepository(ScheduleEntity) private readonly repo: Repository<ScheduleEntity>) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;

    // Seed a small demo schedule for groups (used by admin + student pages).
    await this.repo.save(
      this.repo.create([
        { day: 'Dimanche', time: '08:00', subject: 'Algorithmique', room: 'A12', type: 'Cours', scope: 'group', scopeId: 'G2' },
        { day: 'Dimanche', time: '10:00', subject: 'Réseaux', room: 'Labo R3', type: 'TP', scope: 'group', scopeId: 'G1' },
        { day: 'Lundi', time: '08:00', subject: 'Base de Données', room: 'B04', type: 'TD', scope: 'group', scopeId: 'G1' },
        { day: 'Lundi', time: '14:00', subject: 'Mathématiques', room: 'A08', type: 'Cours', scope: 'group', scopeId: 'G2' },
        { day: 'Mardi', time: '10:00', subject: 'Algorithmique', room: 'Labo Info', type: 'TP', scope: 'group', scopeId: 'G2' },
        { day: 'Samedi', time: '10:00', subject: 'Projet tutoré', room: 'Labo P2', type: 'TP', scope: 'group', scopeId: 'G1' },
      ]),
    );
  }

  byScope(scope: string, scopeId: string) {
    return this.repo.find({ where: { scope: scope as 'student' | 'group' | 'faculty', scopeId } });
  }
}
