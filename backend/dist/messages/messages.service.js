"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
let MessagesService = class MessagesService {
    messagesRepo;
    usersRepo;
    constructor(messagesRepo, usersRepo) {
        this.messagesRepo = messagesRepo;
        this.usersRepo = usersRepo;
    }
    async onModuleInit() {
        const count = await this.messagesRepo.count();
        if (count > 0)
            return;
        const student = await this.usersRepo.findOne({ where: { email: 'student@pui.dz' } });
        const teacher = await this.usersRepo.findOne({ where: { email: 'teacher@pui.dz' } });
        if (!student || !teacher)
            return;
        await this.messagesRepo.save(this.messagesRepo.create([
            {
                conversationId: 't1',
                sender: teacher,
                content: "Bonjour! Bienvenue dans mon cours d'Algorithmique.",
            },
            {
                conversationId: 't1',
                sender: student,
                content: 'Bonjour Professeur! Merci.',
            },
            {
                conversationId: 'group1',
                sender: student,
                content: "Quelqu'un a compris l'exercice 3?",
            },
        ]));
    }
    list(conversationId) {
        return this.messagesRepo.find({ where: { conversationId }, order: { sentAt: 'ASC' } });
    }
    async send(payload) {
        const sender = await this.usersRepo.findOneByOrFail({ id: payload.senderId });
        return this.messagesRepo.save(this.messagesRepo.create({ conversationId: payload.conversationId, sender, content: payload.content }));
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.MessageEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map