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
exports.JustificationsController = void 0;
const common_1 = require("@nestjs/common");
const justifications_service_1 = require("./justifications.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let JustificationsController = class JustificationsController {
    justificationsService;
    constructor(justificationsService) {
        this.justificationsService = justificationsService;
    }
    list() {
        return this.justificationsService.list();
    }
    create(body) {
        return this.justificationsService.create(body.studentId, body.module, body.fileName, body.fileContent, {
            absenceDate: body.absenceDate,
            absenceDay: body.absenceDay,
            absenceTime: body.absenceTime,
        });
    }
    review(id, body) {
        return this.justificationsService.review(Number(id), body.status, body.reviewComment);
    }
};
exports.JustificationsController = JustificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('student', 'admin', 'dean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JustificationsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('student'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JustificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/review'),
    (0, roles_decorator_1.Roles)('admin', 'dean'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JustificationsController.prototype, "review", null);
exports.JustificationsController = JustificationsController = __decorate([
    (0, common_1.Controller)('justifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [justifications_service_1.JustificationsService])
], JustificationsController);
//# sourceMappingURL=justifications.controller.js.map