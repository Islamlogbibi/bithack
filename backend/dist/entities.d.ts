export type UserRole = 'student' | 'teacher' | 'admin' | 'dean';
export declare class UserEntity {
    id: number;
    email: string;
    passwordHash: string;
    fullName: string;
    role: UserRole;
    department: string | null;
    faculty: string | null;
    adminStatsJson: Record<string, number> | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class StudentEntity {
    id: number;
    user: UserEntity;
    matricule: string;
    speciality: string;
    level: string;
    section: string;
    groupName: string;
    average: number;
    absences: number;
    yearLabel: string | null;
    gradesJson: unknown[] | null;
    absencesByModuleJson: Record<string, number> | null;
    notesJson: number[] | null;
    gpaByPeriodJson: {
        year: string;
        semester: string;
        gpa: number;
    }[] | null;
    displayFaculty: string | null;
    displayDepartment: string | null;
    displayModule: string | null;
}
export declare class TeacherEntity {
    id: number;
    user: UserEntity;
    department: string;
    hoursPlanned: number;
    hoursCompleted: number;
    subjectsJson: string[] | null;
    groupsJson: string[] | null;
    pendingGradesJson: unknown[] | null;
    academicCvJson: {
        orcid?: string;
        scopus?: string;
        publications: {
            title: string;
            year: number;
            journal: string;
        }[];
    } | null;
}
export declare class ResourceEntity {
    id: number;
    title: string;
    subject: string;
    type: string;
    fileType: string;
    teacherName: string;
    sizeLabel: string | null;
    isNew: boolean;
    fileContent: string | null;
    groupsJson: string[] | null;
    createdAt: Date;
}
export declare class JustificationEntity {
    id: number;
    student: StudentEntity;
    module: string;
    absenceDate: string;
    absenceDay: string;
    absenceTime: string;
    fileName: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewComment: string | null;
    fileContent: string | null;
    submittedAt: Date;
}
export declare class ValidationEntity {
    id: number;
    teacherName: string;
    module: string;
    groupName: string;
    count: number;
    speciality: string | null;
    level: string | null;
    section: string | null;
    slaHours: number;
    studentGradesJson: {
        student: string;
        matricule: string;
        grade: number;
    }[] | null;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
}
export declare class AttendanceAlertEntity {
    id: number;
    student: StudentEntity;
    subject: string;
    risk: 'low' | 'medium' | 'high';
    status: 'open' | 'dismissed';
    absenceCount: number | null;
    maxAllowed: number | null;
}
export declare class MessageEntity {
    id: number;
    conversationId: string;
    sender: UserEntity;
    content: string;
    sentAt: Date;
}
export declare class SpecialityEntity {
    id: number;
    name: string;
    level: string;
    section: string;
    groupName: string;
}
export declare class ScheduleEntity {
    id: number;
    day: string;
    time: string;
    subject: string;
    room: string;
    type: string;
    scope: 'student' | 'group' | 'faculty';
    scopeId: string;
}
export declare class ReferenceBlobEntity {
    key: string;
    data: unknown;
}
export declare class AssignmentEntity {
    id: number;
    title: string;
    description: string;
    module: string;
    teacherName: string;
    targetGroupsJson: string[];
    deadline: Date;
    createdAt: Date;
}
export declare class AssignmentSubmissionEntity {
    id: number;
    assignment: AssignmentEntity;
    studentId: number;
    studentName: string;
    fileName: string;
    fileContent: string;
    submittedAt: Date;
}
