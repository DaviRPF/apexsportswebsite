import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConcluirTreinoDto } from './dto/concluir-treino.dto';

@Injectable()
export class TreinosService {
  constructor(private prisma: PrismaService) {}

  async getMeusTreinos(alunoId: number) {
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

  async getTreinosPendentes(alunoId: number) {
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

  async getTreinosConcluidos(alunoId: number) {
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

  async concluirTreino(concluirTreinoDto: ConcluirTreinoDto, alunoId: number) {
    const exercicioDesignado = await this.prisma.exercicioDesignado.findUnique({
      where: { id: concluirTreinoDto.exercicioDesignadoId },
      include: {
        exercicio: true,
      },
    });

    if (!exercicioDesignado) {
      throw new NotFoundException('Exercício designado não encontrado');
    }

    if (exercicioDesignado.alunoId !== alunoId) {
      throw new BadRequestException('Este exercício não foi designado para você');
    }

    // Criar registro no histórico
    const historico = await this.prisma.historicoTreino.create({
      data: {
        exercicioDesignadoId: concluirTreinoDto.exercicioDesignadoId,
        alunoId,
        tipoRealizado: concluirTreinoDto.tipoRealizado,
        valorRealizado: concluirTreinoDto.valorRealizado,
      },
    });

    // Atualizar status do exercício designado para concluído
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

  async getHistorico(alunoId: number) {
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

  async getHistoricoPorExercicio(exercicioDesignadoId: number, alunoId: number) {
    const exercicioDesignado = await this.prisma.exercicioDesignado.findUnique({
      where: { id: exercicioDesignadoId },
    });

    if (!exercicioDesignado) {
      throw new NotFoundException('Exercício designado não encontrado');
    }

    if (exercicioDesignado.alunoId !== alunoId) {
      throw new BadRequestException('Este exercício não foi designado para você');
    }

    const historico = await this.prisma.historicoTreino.findMany({
      where: { exercicioDesignadoId },
      orderBy: { dataConclusao: 'desc' },
    });

    return historico;
  }

  async getEstatisticas(alunoId: number) {
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

    // Últimos 7 dias de treinos
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
      percentualConclusao:
        totalDesignados > 0
          ? Math.round((totalConcluidos / totalDesignados) * 100)
          : 0,
    };
  }
}
