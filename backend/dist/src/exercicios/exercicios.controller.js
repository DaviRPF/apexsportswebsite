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
exports.ExerciciosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const exercicios_service_1 = require("./exercicios.service");
const create_exercicio_dto_1 = require("./dto/create-exercicio.dto");
const update_exercicio_dto_1 = require("./dto/update-exercicio.dto");
const designar_exercicio_dto_1 = require("./dto/designar-exercicio.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let ExerciciosController = class ExerciciosController {
    exerciciosService;
    constructor(exerciciosService) {
        this.exerciciosService = exerciciosService;
    }
    create(createExercicioDto, user) {
        return this.exerciciosService.create(createExercicioDto, user.id);
    }
    findAll(modalidade) {
        return this.exerciciosService.findAll(modalidade);
    }
    findDesignadosParaAluno(alunoId) {
        return this.exerciciosService.findDesignadosParaAluno(alunoId);
    }
    findDesignadosPorProfessor(user) {
        return this.exerciciosService.findDesignadosPorProfessor(user.id);
    }
    findOne(id) {
        return this.exerciciosService.findOne(id);
    }
    update(id, updateExercicioDto) {
        return this.exerciciosService.update(id, updateExercicioDto);
    }
    remove(id) {
        return this.exerciciosService.remove(id);
    }
    designarExercicio(designarDto, user) {
        return this.exerciciosService.designarExercicio(designarDto, user.id);
    }
};
exports.ExerciciosController = ExerciciosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm, client_1.TipoUsuario.professor),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo exercício' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exercicio_dto_1.CreateExercicioDto, Object]),
    __metadata("design:returntype", void 0)
], ExerciciosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm, client_1.TipoUsuario.professor),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os exercícios' }),
    (0, swagger_1.ApiQuery)({ name: 'modalidade', required: false }),
    __param(0, (0, common_1.Query)('modalidade')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExerciciosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('designados/aluno/:alunoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar exercícios designados para um aluno' }),
    __param(0, (0, common_1.Param)('alunoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExerciciosController.prototype, "findDesignadosParaAluno", null);
__decorate([
    (0, common_1.Get)('designados/professor'),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm, client_1.TipoUsuario.professor),
    (0, swagger_1.ApiOperation)({ summary: 'Listar exercícios designados pelo professor logado' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExerciciosController.prototype, "findDesignadosPorProfessor", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm, client_1.TipoUsuario.professor),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar exercício por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExerciciosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm, client_1.TipoUsuario.professor),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar exercício' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_exercicio_dto_1.UpdateExercicioDto]),
    __metadata("design:returntype", void 0)
], ExerciciosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm),
    (0, swagger_1.ApiOperation)({ summary: 'Desativar exercício' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExerciciosController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('designar'),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm, client_1.TipoUsuario.professor),
    (0, swagger_1.ApiOperation)({ summary: 'Designar exercício para um aluno' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [designar_exercicio_dto_1.DesignarExercicioDto, Object]),
    __metadata("design:returntype", void 0)
], ExerciciosController.prototype, "designarExercicio", null);
exports.ExerciciosController = ExerciciosController = __decorate([
    (0, swagger_1.ApiTags)('exercicios'),
    (0, common_1.Controller)('exercicios'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [exercicios_service_1.ExerciciosService])
], ExerciciosController);
//# sourceMappingURL=exercicios.controller.js.map