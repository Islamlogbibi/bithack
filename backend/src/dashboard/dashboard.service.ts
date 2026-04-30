import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  student() {
    return { message: 'Student dashboard data', stats: {} };
  }
  teacher() {
    return { message: 'Teacher dashboard data', stats: {} };
  }
  admin() {
    return { message: 'Admin dashboard data', stats: {} };
  }
  dean() {
    return { message: 'Dean dashboard data', stats: {} };
  }
}
