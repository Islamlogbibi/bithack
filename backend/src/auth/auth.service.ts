import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';
import { ScheduleEntity } from '../entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepo: Repository<ScheduleEntity>,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
      email: user.email,
    });

    const profile = await this.buildProfile(user.id);

    return {
      accessToken,
      profile,
    };
  }

  async profileForUserId(userId: number) {
    return this.buildProfile(userId);
  }

  private async buildProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    if (user.role === 'student') {
      const student = await this.studentsService.findByUserId(userId);
      if (!student) {
        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: 'student' as const,
          matricule: '',
          group: '',
          year: '',
          gpa: 0,
          absences: {} as Record<string, number>,
          grades: [] as unknown[],
          schedule: [] as unknown[],
        };
      }
      const schedules = await this.scheduleRepo.find({
        where: [{ scope: 'group', scopeId: student.groupName }],
        order: { day: 'ASC', time: 'ASC' },
      });
      const schedule = schedules.map((s) => ({
        day: s.day,
        time: s.time,
        subject: s.subject,
        room: s.room.includes('Salle') || s.room.includes('Labo') ? s.room : `Salle ${s.room}`,
        type: s.type,
      }));
      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: 'student' as const,
        matricule: student.matricule,
        group: student.groupName,
        year: student.yearLabel ?? `${student.level} ${student.speciality}`,
        gpa: student.average,
        absences: student.absencesByModuleJson ?? {},
        grades: student.gradesJson ?? [],
        schedule,
      };
    }

    if (user.role === 'teacher') {
      const teacher = await this.teachersService.findByUserId(userId);
      if (!teacher) {
        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: 'teacher' as const,
          department: '',
          subjects: [] as string[],
          groups: [] as string[],
          hoursPlanned: 0,
          hoursCompleted: 0,
          pendingGrades: [] as unknown[],
        };
      }
      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: 'teacher' as const,
        department: teacher.department,
        subjects: teacher.subjectsJson ?? [],
        groups: teacher.groupsJson ?? [],
        hoursPlanned: teacher.hoursPlanned,
        hoursCompleted: teacher.hoursCompleted,
        pendingGrades: teacher.pendingGradesJson ?? [],
      };
    }

    if (user.role === 'admin') {
      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: 'admin' as const,
        department: user.department ?? '',
        stats: {
          totalStudents: user.adminStatsJson?.totalStudents ?? 0,
          activeTeachers: user.adminStatsJson?.activeTeachers ?? 0,
          pendingValidations: user.adminStatsJson?.pendingValidations ?? 0,
          avgAttendance: user.adminStatsJson?.avgAttendance ?? 0,
          publishedResources: user.adminStatsJson?.publishedResources ?? 0,
        },
      };
    }

    return {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: 'dean' as const,
      faculty: user.faculty ?? '',
    };
  }
}
