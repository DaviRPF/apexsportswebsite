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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const usuarios_service_1 = require("./usuarios.service");
const create_usuario_dto_1 = require("./dto/create-usuario.dto");
const update_usuario_dto_1 = require("./dto/update-usuario.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let UsuariosController = class UsuariosController {
    usuariosService;
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    create(createUsuarioDto) {
        return this.usuariosService.create(createUsuarioDto);
    }
    findAll(tipo) {
        return this.usuariosService.findAll(tipo);
    }
    findAlunos() {
        return this.usuariosService.findAlunos();
    }
    findOne(id) {
        return this.usuariosService.findOne(id);
    }
    update(id, updateUsuarioDto) {
        return this.usuariosService.update(id, updateUsuarioDto);
    }
    updateFotoPerfil(id, fotoUrl) {
        return this.usuariosService.updateFotoPerfil(id, fotoUrl);
    }
    remove(id) {
        return this.usuariosService.remove(id);
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo usuário (apenas admin/professoradm)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_usuario_dto_1.CreateUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm, client_1.TipoUsuario.professor),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os usuários' }),
    (0, swagger_1.ApiQuery)({ name: 'tipo', enum: client_1.TipoUsuario, required: false }),
    __param(0, (0, common_1.Query)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('alunos'),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm, client_1.TipoUsuario.professor),
    (0, swagger_1.ApiOperation)({ summary: 'Listar apenas alunos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "findAlunos", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar usuário por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar usuário (apenas admin/professoradm)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_usuario_dto_1.UpdateUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/foto'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar foto de perfil' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('fotoUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "updateFotoPerfil", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.TipoUsuario.admin, client_1.TipoUsuario.professoradm),
    (0, swagger_1.ApiOperation)({ summary: 'Desativar usuário (apenas admin/professoradm)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "remove", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, swagger_1.ApiTags)('usuarios'),
    (0, common_1.Controller)('usuarios'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map