import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherEntity, UserEntity } from '../entities';
import { Repository } from 'typeorm';

const PENDING_GRADES = [
  { student: 'Ahmed Bouali', matricule: '202012301', group: 'G1', td: 14, exam: null, status: 'En attente' },
  { student: 'Sara Mansouri', matricule: '202012302', group: 'G1', td: 16, exam: null, status: 'En attente' },
  { student: 'Yacine Ferhat', matricule: '202012303', group: 'G2', td: 11, exam: null, status: 'En attente' },
  { student: 'Nadia Cherif', matricule: '202012304', group: 'G2', td: 15, exam: null, status: 'En attente' },
  { student: 'Omar Bensalem', matricule: '202012305', group: 'G3', td: 9, exam: null, status: 'En attente' },
];

@Injectable()
export class TeachersService implements OnModuleInit {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teachersRepo: Repository<TeacherEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.teachersRepo.count();
    if (count > 0) return;
    const user = await this.usersRepo.findOne({ where: { email: 'teacher@pui.dz' } });
    if (!user) return;
    await this.teachersRepo.save(
      this.teachersRepo.create({
        user,
        department: 'Informatique',
        hoursPlanned: 96,
        hoursCompleted: 72,
        subjectsJson: ['Algorithmique', 'Structures de Données'],
        groupsJson: ['G1', 'G2', 'G3'],
        pendingGradesJson: PENDING_GRADES,
      }),
    );
  }

  list() {
    return this.teachersRepo.find();
  }

  findByUserId(userId: number) {
    return this.teachersRepo.findOne({ where: { user: { id: userId } }, relations: { user: true } });
  }

  async update(id: number, data: { subjectsJson?: string[]; groupsJson?: string[] }) {
    await this.teachersRepo.update(id, data);
    return this.teachersRepo.findOne({ where: { id }, relations: { user: true } });
  }
}
