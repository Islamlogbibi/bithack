import { Repository } from 'typeorm';
import { StudentEntity, UserEntity, GradeEntity, PresenceEntity, SpecialityEntity, LevelEntity, SectionEntity, GroupEntity } from '../entities';
export declare class StudentsService {
    private readonly repo;
    private readonly usersRepo;
    private readonly gradeRepo;
    private readonly presenceRepo;
    private readonly specRepo;
    private readonly levelRepo;
    private readonly sectionRepo;
    private readonly groupRepo;
    constructor(repo: Repository<StudentEntity>, usersRepo: Repository<UserEntity>, gradeRepo: Repository<GradeEntity>, presenceRepo: Repository<PresenceEntity>, specRepo: Repository<SpecialityEntity>, levelRepo: Repository<LevelEntity>, sectionRepo: Repository<SectionEntity>, groupRepo: Repository<GroupEntity>);
    list(filters: Record<string, string | undefined>): Promise<StudentEntity[]>;
    findByUserId(userId: number): Promise<StudentEntity | null>;
    create(payload: any): Promise<StudentEntity>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
