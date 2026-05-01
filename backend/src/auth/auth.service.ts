import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleEntity, UserEntity } from '../entities';
import { Repository } from 'typeorm';

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

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
      email: user.email,
    });

    const profile = await this.buildProfile(user.id);
    return { accessToken, profile };
  }

  async profileForUserId(userId: number) {
    return this.buildProfile(userId);
  }

  private async buildProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    if (user.role === 'student') {
      const student = await this.studentsService.findByUserId(userId);
      if (!student) return { id: user.id, name: user.fullName, email: user.email, role: 'student' as const };

      const schedules = await this.scheduleRepo.find({
        where: [
          { group: { id: student.group?.id } },
          { section: { id: student.section?.id } }
        ],
        relations: ['course', 'course.teacher', 'course.teacher.user'],
        order: { dateSeance: 'ASC', heureDebut: 'ASC' }
      });

      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: 'student' as const,
        matricule: student.matricule,
        year: student.level?.libelle || 'N/A',
        speciality: student.speciality?.libelle,
        level: student.level?.libelle,
        section: student.section?.code,
        group: student.group?.code,
        displayDepartment: student.speciality?.department?.libelle || 'Informatique',
        gpa: Number(student.average || 0),
        absences: {},
        grades: student.grades?.map(g => ({
          subject: g.course?.intitule,
          td: g.tdGrade ?? null,
          exam: g.examGrade ?? null,
          final: g.finalGrade ?? g.valeur ?? null,
          status: g.status || g.statut || 'En attente',
          credits: g.credits ?? g.course?.credits ?? 0
        })) || [],
        schedule: schedules.map(s => ({
          day: s.dateSeance, // In a real app we'd map this to a day string
          time: s.heureDebut,
          subject: s.course?.intitule,
          room: s.salle,
          type: s.course?.type || 'Cours',
          teacher: s.course?.teacher?.user?.fullName
        }))
      };
    }

    if (user.role === 'teacher') {
      const teacher = await this.teachersService.findByUserId(userId);
      if (!teacher) return { id: user.id, name: user.fullName, email: user.email, role: 'teacher' as const };

      const subjects = [...new Set((teacher.modules || []).map(m => m.subject).filter(Boolean))];
      const groups = [...new Set((teacher.modules || []).map(m => m.groupName).filter(Boolean))];

      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: 'teacher' as const,
        department: teacher.department?.libelle,
        orcid: teacher.orcid,
        scopusId: teacher.scopusId,
        subjects,
        groups,
        hoursPlanned: Number(teacher.hoursPlanned || 0),
        hoursCompleted: Number(teacher.hoursCompleted || 0),
        pendingGrades: [],
        courses: teacher.courses?.map(c => ({
          id: c.id,
          name: c.intitule,
          level: c.level?.libelle
        })) || []
      };
    }

    if (user.role === 'admin') {
      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: 'admin' as const,
        department: user.department || 'Administration',
        adminStats: user.adminStatsJson || {
          totalStudents: 1500,
          pendingValidations: 8,
          activeAlerts: 12,
          faculty: 'Faculté des Sciences',
        },
      };
    }

    return { id: user.id, name: user.fullName, email: user.email, role: user.role };
  }
}
