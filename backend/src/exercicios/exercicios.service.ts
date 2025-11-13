import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';
import { DesignarExercicioDto } from './dto/designar-exercicio.dto';

@Injectable()
export class ExerciciosService {
  constructor(private prisma: PrismaService) {}

  async create(createExercicioDto: CreateExercicioDto, criadoPor: number) {
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

  async findAll(modalidade?: string) {
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

  async findOne(id: number) {
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
      throw new NotFoundException('Exercício não encontrado');
    }

    return exercicio;
  }

  async update(id: number, updateExercicioDto: UpdateExercicioDto) {
    const exercicio = await this.prisma.exercicio.findUnique({
      where: { id },
    });

    if (!exercicio) {
      throw new NotFoundException('Exercício não encontrado');
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

  async remove(id: number) {
    const exercicio = await this.prisma.exercicio.findUnique({
      where: { id },
    });

    if (!exercicio) {
      throw new NotFoundException('Exercício não encontrado');
    }

    await this.prisma.exercicio.update({
      where: { id },
      data: { ativo: false },
    });

    return { message: 'Exercício desativado com sucesso' };
  }

  async designarExercicio(designarDto: DesignarExercicioDto, professorId: number) {
    const exercicio = await this.prisma.exercicio.findUnique({
      where: { id: designarDto.exercicioId },
    });

    if (!exercicio) {
      throw new NotFoundException('Exercício não encontrado');
    }

    const aluno = await this.prisma.usuario.findUnique({
      where: { id: designarDto.alunoId, tipo: 'aluno' },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
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

  async findDesignadosParaAluno(alunoId: number) {
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

  async findDesignadosPorProfessor(professorId: number) {
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
}
