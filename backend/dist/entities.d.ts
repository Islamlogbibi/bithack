export type UserRole = 'admin' | 'student' | 'teacher' | 'dean';
export declare class UserEntity {
    id: number;
    email: string;
    fullName: string;
    passwordHash: string;
    role: UserRole;
    department: string;
    faculty: string;
    adminStatsJson: any;
    student?: any;
    teacher?: any;
}
export declare class DepartmentEntity {
    id: number;
    libelle: string;
    code: string;
    specialities: any[];
    teachers: any[];
    chef: any;
}
export declare class SpecialityEntity {
    id: number;
    code: string;
    libelle: string;
    department: any;
    levels: any[];
}
export declare class LevelEntity {
    id: number;
    code: string;
    libelle: string;
    speciality: any;
    sections: any[];
}
export declare class SectionEntity {
    id: number;
    code: string;
    level: any;
    groups: any[];
}
export declare class GroupEntity {
    id: number;
    code: string;
    type: string;
    section: any;
}
export declare class StudentEntity {
    id: number;
    user: any;
    nom: string;
    prenom: string;
    numCarte: string;
    speciality: any;
    level: any;
    section: any;
    group: any;
    average: number;
    grades: any[];
    presences: any[];
}
export declare class TeacherEntity {
    id: number;
    user: any;
    department: any;
    nom: string;
    prenom: string;
    orcid: string;
    scopusId: string;
    courses: any[];
    cv: any;
}
export declare class CourseEntity {
    id: number;
    intitule: string;
    codeCours: string;
    credits: number;
    type: string;
    teacher: any;
    speciality: any;
    level: any;
}
export declare class ScheduleEntity {
    id: number;
    dateSeance: Date;
    heureDebut: string;
    heureFin: string;
    salle: string;
    codeQr: string;
    course: any;
    section: any;
    group: any;
    level: any;
    speciality: any;
}
export declare class GradeEntity {
    id: number;
    valeur: number;
    session: string;
    statut: string;
    dateSaisie: Date;
    dateValidation: Date;
    student: any;
    course: any;
    teacher: any;
    validation: any;
}
export declare class PresenceEntity {
    id: number;
    horodatage: Date;
    methode: string;
    student: any;
    schedule: any;
}
export declare class CVAcademiqueEntity {
    id: number;
    orcid: string;
    dateSync: Date;
    teacher: any;
}
export declare class TeacherSpecialityEntity {
    id: number;
    teacher: any;
    speciality: any;
    level: any;
}
export declare class ValidationEntity {
    id: number;
    teacher: any;
    course: any;
    group: any;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    grades: any[];
}
export declare class ResourceEntity {
    id: number;
    title: string;
    course: any;
    type: string;
    date: string;
    size: string;
    url: string;
    group: any;
    createdAt: Date;
}
export declare class JustificationEntity {
    id: number;
    student: any;
    course: any;
    status: 'pending' | 'approved' | 'rejected';
    fileName: string;
    fileContent: string;
    absenceDate: string;
    reviewComment: string;
    submittedAt: Date;
}
export declare class MessageEntity {
    id: number;
    conversationId: string;
    sender: any;
    content: string;
    timestamp: Date;
}
export declare class AttendanceAlertEntity {
    id: number;
    student: any;
    course: any;
    absences: number;
    severity: 'low' | 'medium' | 'high';
    dismissed: boolean;
    status: string;
    createdAt: Date;
}
export declare class ReferenceBlobEntity {
    id: number;
    key: string;
    data: any;
}
export declare class AssignmentEntity {
    id: number;
    title: string;
    course: any;
    dueDate: string;
    description: string;
    groups: any[];
    teacher: any;
    createdAt: Date;
}
export declare class AssignmentSubmissionEntity {
    id: number;
    assignment: any;
    student: any;
    fileName: string;
    fileContent: string;
    submittedAt: Date;
}
