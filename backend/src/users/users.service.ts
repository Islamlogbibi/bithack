import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from '../entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.usersRepo.count();
    if (count > 0) return;

    await this.createSeedUser('student@pui.dz', 'student123', 'Mabrouk Benali', 'student');
    await this.createSeedUser('teacher@pui.dz', 'teacher123', 'Dr. Karim Meziani', 'teacher');
    const admin = await this.createSeedUser('admin@pui.dz', 'admin123', 'Prof. Amina Hadj', 'admin');
    admin.department = 'Département Informatique';
    admin.adminStatsJson = {
      totalStudents: 342,
      activeTeachers: 28,
      pendingValidations: 7,
      avgAttendance: 87,
      publishedResources: 156,
    };
    await this.usersRepo.save(admin);
    const dean = await this.createSeedUser('dean@pui.dz', 'dean123', 'Pr. Samia Belkacem', 'dean');
    dean.faculty = 'Faculté des Sciences et Technologies';
    await this.usersRepo.save(dean);

    const extraAccounts: { email: string; password: string; name: string }[] = [
      { email: 'k.bouzid@pui.dz', password: 'student123', name: 'Khalil Bouzid' },
      { email: 'r.slimani@pui.dz', password: 'student123', name: 'Rania Slimani' },
      { email: 'f.taleb@pui.dz', password: 'student123', name: 'Fares Taleb' },
      { email: 'h.amrani@pui.dz', password: 'student123', name: 'Houda Amrani' },
    ];
    for (const a of extraAccounts) {
      await this.createSeedUser(a.email, a.password, a.name, 'student');
    }
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  private async createSeedUser(
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
  ) {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.usersRepo.save(
      this.usersRepo.create({
        email,
        passwordHash,
        fullName,
        role,
      }),
    );
  }
}
