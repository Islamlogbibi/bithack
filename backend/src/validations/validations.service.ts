import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class ValidationsService {
  constructor(@InjectRepository(ValidationEntity) private readonly repo: Repository<ValidationEntity>) {}
  list() {
    return this.repo.find({ order: { submittedAt: 'DESC' } });
  }
  review(id: number, status: 'approved' | 'rejected') {
    return this.repo.update({ id }, { status });
  }
}
