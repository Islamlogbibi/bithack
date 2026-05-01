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
exports.SchedulesController = void 0;
const common_1 = require("@nestjs/common");
const schedules_service_1 = require("./schedules.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let SchedulesController = class SchedulesController {
    schedulesService;
    constructor(schedulesService) {
        this.schedulesService = schedulesService;
    }
    byScope(scope, scopeId) {
        return this.schedulesService.byScope(scope, scopeId);
    }
    listAll() {
        return this.schedulesService.listAll();
    }
    create(data) {
        return this.schedulesService.create(data);
    }
    delete(id) {
        return this.schedulesService.delete(+id);
    }
};
exports.SchedulesController = SchedulesController;
__decorate([
    (0, common_1.Get)(':scope/:scopeId'),
    (0, roles_decorator_1.Roles)('student', 'teacher', 'admin', 'dean'),
    __param(0, (0, common_1.Param)('scope')),
    __param(1, (0, common_1.Param)('scopeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "byScope", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'dean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "listAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "delete", null);
exports.SchedulesController = SchedulesController = __decorate([
    (0, common_1.Controller)('schedules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [schedules_service_1.SchedulesService])
], SchedulesController);
//# sourceMappingURL=schedules.controller.js.map