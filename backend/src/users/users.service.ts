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
    await this.createSeedUser('admin@pui.dz', 'admin123', 'Prof. Amina Hadj', 'admin');
    await this.createSeedUser('dean@pui.dz', 'dean123', 'Pr. Samia Belkacem', 'dean');
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
