"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'bithack',
    entities: [
        entities_1.UserEntity, entities_1.StudentEntity, entities_1.TeacherEntity, entities_1.GradeEntity, entities_1.PresenceEntity,
        entities_1.DepartmentEntity, entities_1.SpecialityEntity, entities_1.LevelEntity, entities_1.SectionEntity, entities_1.GroupEntity,
        entities_1.CourseEntity, entities_1.CVAcademiqueEntity, entities_1.TeacherSpecialityEntity, entities_1.TeacherModuleEntity,
        entities_1.ResourceEntity, entities_1.JustificationEntity, entities_1.ValidationEntity, entities_1.AttendanceAlertEntity,
        entities_1.MessageEntity, entities_1.ScheduleEntity, entities_1.ReferenceBlobEntity, entities_1.AssignmentEntity, entities_1.AssignmentSubmissionEntity
    ],
    synchronize: false,
});
async function addJustifications() {
    await dataSource.initialize();
    const justifRepo = dataSource.getRepository(entities_1.JustificationEntity);
    const studentRepo = dataSource.getRepository(entities_1.StudentEntity);
    const students = await studentRepo.find({ relations: ['user', 'speciality', 'level', 'section', 'group'], take: 4 });
    if (students.length < 4) {
        console.error('Not enough students in DB');
        process.exit(1);
    }
    const mockData = [
        {
            module: 'Algorithmique',
            fileName: 'justification_yasmina.pdf',
            status: 'pending',
            reviewComment: '',
        },
        {
            module: 'Base de données',
            fileName: 'justification_karim.pdf',
            status: 'pending',
            reviewComment: '',
        },
        {
            module: 'Analyse',
            fileName: 'justification_meriem.pdf',
            status: 'approved',
            reviewComment: 'Justification validée après réception du certificat médical.',
        },
        {
            module: 'Mécanique',
            fileName: 'justification_oussama.pdf',
            status: 'rejected',
            reviewComment: 'Document non conforme, en attente de pièce complémentaire.',
        }
    ];
    await justifRepo.clear();
    for (let i = 0; i < mockData.length; i++) {
        const student = students[i];
        const data = mockData[i];
        const j = justifRepo.create({
            student,
            module: data.module,
            status: data.status,
            fileName: data.fileName,
            reviewComment: data.reviewComment,
        });
        await justifRepo.save(j);
    }
    console.log('Successfully seeded 4 justifications!');
    await dataSource.destroy();
}
addJustifications().catch(console.error);
//# sourceMappingURL=add-justifications.js.map