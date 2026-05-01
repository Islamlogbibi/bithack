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
    name: string;
    level: string;
    section: string;
    groupName: string;
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
    matricule: string;
    gradesJson: any;
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
    hoursPlanned: number;
    hoursCompleted: number;
    academicCvJson: any;
    subjectsJson: any;
    groupsJson: any;
    courses: any[];
    modules: any[];
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
    day: string;
    timeSlot: string;
    subject: string;
    sessionType: string;
    room: string;
    codeQr: string;
    course: any;
    teacher: any;
    section: any;
    group: any;
    groupName: string;
    level: any;
    speciality: any;
}
export declare class GradeEntity {
    id: number;
    valeur: number;
    session: string;
    statut: string;
    subject: string;
    tdGrade: number;
    examGrade: number;
    finalGrade: number;
    credits: number;
    status: string;
    semester: string;
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
export declare class TeacherModuleEntity {
    id: number;
    teacher: any;
    subject: string;
    groupName: string;
}
export declare class ValidationEntity {
    id: number;
    teacher: any;
    course: any;
    group: any;
    subject: string;
    groupName: string;
    studentGradesJson: any;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    reviewedAt: Date;
    reviewedBy: any;
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
    subject: string;
    fileType: string;
    teacherName: string;
    sizeLabel: string;
    isNew: boolean;
    fileContent: string;
    groupsJson: any;
    specialityName: string;
    levelName: string;
    sectionName: string;
    groupName: string;
    createdAt: Date;
}
export declare class JustificationEntity {
    id: number;
    student: any;
    course: any;
    module: string;
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
    module: string;
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
    teacherName: string;
    createdAt: Date;
}
export declare class AssignmentSubmissionEntity {
    id: number;
    assignment: any;
    student: any;
    studentId: number;
    studentName: string;
    fileName: string;
    fileContent: string;
    submittedAt: Date;
}
