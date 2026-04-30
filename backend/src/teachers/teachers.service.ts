import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teachersRepo: Repository<TeacherEntity>,
  ) {}

  list() {
    return this.teachersRepo.find();
  }
}
