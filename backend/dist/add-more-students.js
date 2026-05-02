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
const bcrypt = __importStar(require("bcrypt"));
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
async function addMoreStudents() {
    await dataSource.initialize();
    const studentRepo = dataSource.getRepository(entities_1.StudentEntity);
    const userRepo = dataSource.getRepository(entities_1.UserEntity);
    const groupRepo = dataSource.getRepository(entities_1.GroupEntity);
    const passwordHash = await bcrypt.hash('password123', 10);
    const firstNames = ['Youssef', 'Nour', 'Ayoub', 'Lydia', 'Hassan', 'Rima', 'Omar', 'Khadija', 'Sofiane', 'Nadia', 'Billel', 'Amira', 'Reda', 'Chaima', 'Fares', 'Houda', 'Hamza', 'Nesrine', 'Yacine', 'Imad'];
    const lastNames = ['Othmani', 'Boualem', 'Gacem', 'Lounes', 'Amara', 'Messaoudi', 'Djerroud', 'Boukli', 'Hamidi', 'Belhadj', 'Sahraoui', 'Naceri', 'Kacemi', 'Benmoussa', 'Derbal', 'Boumaza', 'Zitouni', 'Guendouz', 'Fatah', 'Khouider'];
    const groups = await groupRepo.find({
        relations: ['section', 'section.level', 'section.level.speciality']
    });
    let count = 0;
    let globalIndex = 50;
    for (const group of groups) {
        const section = group.section;
        const level = section?.level;
        const speciality = level?.speciality;
        if (!section || !level || !speciality)
            continue;
        for (let i = 0; i < 5; i++) {
            const fn = firstNames[(globalIndex + i) % firstNames.length];
            const ln = lastNames[(globalIndex + i) % lastNames.length];
            const fullName = `${fn} ${ln}`;
            const email = `student.more${globalIndex}@pui.dz`;
            const user = userRepo.create({
                email,
                passwordHash,
                fullName,
                role: 'student'
            });
            const savedUser = await userRepo.save(user);
            const matricule = `2025MORE${String(globalIndex).padStart(3, '0')}`;
            const student = studentRepo.create({
                user: savedUser,
                matricule,
                speciality,
                level,
                section,
                group
            });
            await studentRepo.save(student);
            count++;
            globalIndex++;
        }
    }
    console.log(`Successfully added ${count} students across all available groups!`);
    await dataSource.destroy();
}
addMoreStudents().catch(console.error);
//# sourceMappingURL=add-more-students.js.map