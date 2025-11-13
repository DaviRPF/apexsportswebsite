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
exports.TreinosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const treinos_service_1 = require("./treinos.service");
const concluir_treino_dto_1 = require("./dto/concluir-treino.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let TreinosController = class TreinosController {
    treinosService;
    constructor(treinosService) {
        this.treinosService = treinosService;
    }
    getMeusTreinos(user) {
        return this.treinosService.getMeusTreinos(user.id);
    }
    getTreinosPendentes(user) {
        return this.treinosService.getTreinosPendentes(user.id);
    }
    getTreinosConcluidos(user) {
        return this.treinosService.getTreinosConcluidos(user.id);
    }
    concluirTreino(concluirTreinoDto, user) {
        return this.treinosService.concluirTreino(concluirTreinoDto, user.id);
    }
    getHistorico(user) {
        return this.treinosService.getHistorico(user.id);
    }
    getHistoricoPorExercicio(exercicioDesignadoId, user) {
        return this.treinosService.getHistoricoPorExercicio(exercicioDesignadoId, user.id);
    }
    getEstatisticas(user) {
        return this.treinosService.getEstatisticas(user.id);
    }
};
exports.TreinosController = TreinosController;
__decorate([
    (0, common_1.Get)('meus-treinos'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar meus treinos (todos)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreinosController.prototype, "getMeusTreinos", null);
__decorate([
    (0, common_1.Get)('pendentes'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar treinos pendentes' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreinosController.prototype, "getTreinosPendentes", null);
__decorate([
    (0, common_1.Get)('concluidos'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar treinos concluídos' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreinosController.prototype, "getTreinosConcluidos", null);
__decorate([
    (0, common_1.Post)('concluir'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar treino como concluído' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [concluir_treino_dto_1.ConcluirTreinoDto, Object]),
    __metadata("design:returntype", void 0)
], TreinosController.prototype, "concluirTreino", null);
__decorate([
    (0, common_1.Get)('historico'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar histórico completo de treinos' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreinosController.prototype, "getHistorico", null);
__decorate([
    (0, common_1.Get)('historico/:exercicioDesignadoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar histórico de um exercício específico' }),
    __param(0, (0, common_1.Param)('exercicioDesignadoId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TreinosController.prototype, "getHistoricoPorExercicio", null);
__decorate([
    (0, common_1.Get)('estatisticas'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas de treinos do aluno' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreinosController.prototype, "getEstatisticas", null);
exports.TreinosController = TreinosController = __decorate([
    (0, swagger_1.ApiTags)('treinos'),
    (0, common_1.Controller)('treinos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [treinos_service_1.TreinosService])
], TreinosController);
//# sourceMappingURL=treinos.controller.js.map