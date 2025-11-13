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
exports.TreinosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let TreinosService = class TreinosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMeusTreinos(alunoId) {
        const treinos = await this.prisma.exercicioDesignado.findMany({
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
                historico: {
                    orderBy: { dataConclusao: 'desc' },
                    take: 5,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return treinos;
    }
    async getTreinosPendentes(alunoId) {
        const treinos = await this.prisma.exercicioDesignado.findMany({
            where: {
                alunoId,
                status: 'pendente',
            },
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
            orderBy: { createdAt: 'asc' },
        });
        return treinos;
    }
    async getTreinosConcluidos(alunoId) {
        const treinos = await this.prisma.exercicioDesignado.findMany({
            where: {
                alunoId,
                status: 'concluido',
            },
            include: {
                exercicio: true,
                professor: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
                historico: {
                    orderBy: { dataConclusao: 'desc' },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return treinos;
    }
    async concluirTreino(concluirTreinoDto, alunoId) {
        const exercicioDesignado = await this.prisma.exercicioDesignado.findUnique({
            where: { id: concluirTreinoDto.exercicioDesignadoId },
            include: {
                exercicio: true,
            },
        });
        if (!exercicioDesignado) {
            throw new common_1.NotFoundException('Exercício designado não encontrado');
        }
        if (exercicioDesignado.alunoId !== alunoId) {
            throw new common_1.BadRequestException('Este exercício não foi designado para você');
        }
        const historico = await this.prisma.historicoTreino.create({
            data: {
                exercicioDesignadoId: concluirTreinoDto.exercicioDesignadoId,
                alunoId,
                tipoRealizado: concluirTreinoDto.tipoRealizado,
                valorRealizado: concluirTreinoDto.valorRealizado,
            },
        });
        const updated = await this.prisma.exercicioDesignado.update({
            where: { id: concluirTreinoDto.exercicioDesignadoId },
            data: { status: 'concluido' },
            include: {
                exercicio: true,
                historico: {
                    orderBy: { dataConclusao: 'desc' },
                    take: 1,
                },
            },
        });
        return updated;
    }
    async getHistorico(alunoId) {
        const historico = await this.prisma.historicoTreino.findMany({
            where: { alunoId },
            include: {
                exercicioDesignado: {
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
                },
            },
            orderBy: { dataConclusao: 'desc' },
        });
        return historico;
    }
    async getHistoricoPorExercicio(exercicioDesignadoId, alunoId) {
        const exercicioDesignado = await this.prisma.exercicioDesignado.findUnique({
            where: { id: exercicioDesignadoId },
        });
        if (!exercicioDesignado) {
            throw new common_1.NotFoundException('Exercício designado não encontrado');
        }
        if (exercicioDesignado.alunoId !== alunoId) {
            throw new common_1.BadRequestException('Este exercício não foi designado para você');
        }
        const historico = await this.prisma.historicoTreino.findMany({
            where: { exercicioDesignadoId },
            orderBy: { dataConclusao: 'desc' },
        });
        return historico;
    }
    async getEstatisticas(alunoId) {
        const totalDesignados = await this.prisma.exercicioDesignado.count({
            where: { alunoId },
        });
        const totalConcluidos = await this.prisma.exercicioDesignado.count({
            where: { alunoId, status: 'concluido' },
        });
        const totalPendentes = await this.prisma.exercicioDesignado.count({
            where: { alunoId, status: 'pendente' },
        });
        const totalTreinos = await this.prisma.historicoTreino.count({
            where: { alunoId },
        });
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
        const treinosUltimos7Dias = await this.prisma.historicoTreino.count({
            where: {
                alunoId,
                dataConclusao: {
                    gte: seteDiasAtras,
                },
            },
        });
        return {
            totalDesignados,
            totalConcluidos,
            totalPendentes,
            totalTreinos,
            treinosUltimos7Dias,
            percentualConclusao: totalDesignados > 0
                ? Math.round((totalConcluidos / totalDesignados) * 100)
                : 0,
        };
    }
};
exports.TreinosService = TreinosService;
exports.TreinosService = TreinosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TreinosService);
//# sourceMappingURL=treinos.service.js.map