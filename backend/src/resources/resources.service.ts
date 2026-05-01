import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceEntity } from '../entities';
import { Repository } from 'typeorm';

const SEED = [
  { title: 'Cours Algorithmique — Chapitre 3', subject: 'Algorithmique', type: 'Cours', fileType: 'PDF', teacherName: 'Dr. Meziani', sizeLabel: '2.4 MB', isNew: true },
  { title: 'TD Algorithmique N°5 — Arbres', subject: 'Algorithmique', type: 'TD', fileType: 'PDF', teacherName: 'Dr. Meziani', sizeLabel: '1.1 MB', isNew: true },
  { title: 'Cours Réseaux — Protocoles TCP/IP', subject: 'Réseaux', type: 'Cours', fileType: 'PPT', teacherName: 'Dr. Boualem', sizeLabel: '5.6 MB', isNew: false },
  { title: 'TP Réseaux — Configuration Router', subject: 'Réseaux', type: 'TP', fileType: 'PDF', teacherName: 'Dr. Boualem', sizeLabel: '0.8 MB', isNew: false },
  { title: 'Cours Base de Données — SQL Avancé', subject: 'Base de Données', type: 'Cours', fileType: 'PDF', teacherName: 'Mme. Rahmani', sizeLabel: '3.2 MB', isNew: false },
  { title: 'Examen BDD 2024 — Corrigé', subject: 'Base de Données', type: 'Exam', fileType: 'PDF', teacherName: 'Mme. Rahmani', sizeLabel: '0.6 MB', isNew: false },
  { title: 'Cours Mathématiques — Analyse', subject: 'Mathématiques', type: 'Cours', fileType: 'PDF', teacherName: 'Dr. Laadj', sizeLabel: '4.1 MB', isNew: false },
  { title: 'TD Anglais Technique N°3', subject: 'Anglais Technique', type: 'TD', fileType: 'DOC', teacherName: 'Mme. Ferhat', sizeLabel: '0.4 MB', isNew: false },
];

@Injectable()
export class ResourcesService implements OnModuleInit {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepo: Repository<ResourceEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.resourceRepo.count();
    if (count > 0) return;
    await this.resourceRepo.save(this.resourceRepo.create(SEED));
  }

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
