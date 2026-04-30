export type UserRole = 'student' | 'teacher' | 'admin' | 'dean';
export declare class UserEntity {
    id: number;
    email: string;
    passwordHash: string;
    fullName: string;
    role: UserRole;
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
}
export declare class TeacherEntity {
    id: number;
    user: UserEntity;
    department: string;
    hoursPlanned: number;
    hoursCompleted: number;
}
export declare class ResourceEntity {
    id: number;
    title: string;
    subject: string;
    type: string;
    fileType: string;
    teacherName: string;
    createdAt: Date;
}
export declare class JustificationEntity {
    id: number;
    student: StudentEntity;
    module: string;
    fileName: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewComment: string | null;
    submittedAt: Date;
}
export declare class ValidationEntity {
    id: number;
    teacherName: string;
    module: string;
    groupName: string;
    count: number;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
}
export declare class AttendanceAlertEntity {
    id: number;
    student: StudentEntity;
    subject: string;
    risk: 'low' | 'medium' | 'high';
    status: 'open' | 'dismissed';
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
