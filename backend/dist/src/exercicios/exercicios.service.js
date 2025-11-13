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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciciosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ExerciciosService = class ExerciciosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createExercicioDto, criadoPor) {
        const exercicio = await this.prisma.exercicio.create({
            data: {
                ...createExercicioDto,
                criadoPor,
            },
            include: {
                criador: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
            },
        });
        return exercicio;
    }
    async findAll(modalidade) {
        const where = modalidade ? { modalidade, ativo: true } : { ativo: true };
        return this.prisma.exercicio.findMany({
            where,
            include: {
                criador: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        designacoes: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const exercicio = await this.prisma.exercicio.findUnique({
            where: { id },
            include: {
                criador: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
                designacoes: {
                    include: {
                        aluno: {
                            select: {
                                id: true,
                                nome: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!exercicio) {
            throw new common_1.NotFoundException('Exercício não encontrado');
        }
        return exercicio;
    }
    async update(id, updateExercicioDto) {
        const exercicio = await this.prisma.exercicio.findUnique({
            where: { id },
        });
        if (!exercicio) {
            throw new common_1.NotFoundException('Exercício não encontrado');
        }
        const updated = await this.prisma.exercicio.update({
            where: { id },
            data: updateExercicioDto,
            include: {
                criador: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
            },
        });
        return updated;
    }
    async remove(id) {
        const exercicio = await this.prisma.exercicio.findUnique({
            where: { id },
        });
        if (!exercicio) {
            throw new common_1.NotFoundException('Exercício não encontrado');
        }
        await this.prisma.exercicio.update({
            where: { id },
            data: { ativo: false },
        });
        return { message: 'Exercício desativado com sucesso' };
    }
    async designarExercicio(designarDto, professorId) {
        const exercicio = await this.prisma.exercicio.findUnique({
            where: { id: designarDto.exercicioId },
        });
        if (!exercicio) {
            throw new common_1.NotFoundException('Exercício não encontrado');
        }
        const aluno = await this.prisma.usuario.findUnique({
            where: { id: designarDto.alunoId, tipo: 'aluno' },
        });
        if (!aluno) {
            throw new common_1.NotFoundException('Aluno não encontrado');
        }
        const designacao = await this.prisma.exercicioDesignado.create({
            data: {
                exercicioId: designarDto.exercicioId,
                alunoId: designarDto.alunoId,
                professorId,
                tipoOrientacao: designarDto.tipoOrientacao,
                valorOrientacao: designarDto.valorOrientacao,
            },
            include: {
                exercicio: true,
                aluno: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
                professor: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
            },
        });
        return designacao;
    }
    async findDesignadosParaAluno(alunoId) {
        return this.prisma.exercicioDesignado.findMany({
            where: { alunoId },
            include: {
                exercicio: true,
                professor: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findDesignadosPorProfessor(professorId) {
        return this.prisma.exercicioDesignado.findMany({
            where: { professorId },
            include: {
                exercicio: true,
                aluno: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        fotoPerfil: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ExerciciosService = ExerciciosService;
exports.ExerciciosService = ExerciciosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExerciciosService);
//# sourceMappingURL=exercicios.service.js.map