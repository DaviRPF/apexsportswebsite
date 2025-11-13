import { ExerciciosService } from './exercicios.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';
import { DesignarExercicioDto } from './dto/designar-exercicio.dto';
import type { Usuario } from '@prisma/client';
export declare class ExerciciosController {
    private readonly exerciciosService;
    constructor(exerciciosService: ExerciciosService);
    create(createExercicioDto: CreateExercicioDto, user: Usuario): Promise<{
        criador: {
            id: number;
            email: string;
            nome: string;
        };
    } & {
        id: number;
        nome: string;
        ativo: boolean;
        createdAt: Date;
        descricao: string | null;
        modalidade: string;
        fundamento: string;
        subFundamento: string | null;
        criadoPor: number;
    }>;
    findAll(modalidade?: string): Promise<({
        _count: {
            designacoes: number;
        };
        criador: {
            id: number;
            email: string;
            nome: string;
        };
    } & {
        id: number;
        nome: string;
        ativo: boolean;
        createdAt: Date;
        descricao: string | null;
        modalidade: string;
        fundamento: string;
        subFundamento: string | null;
        criadoPor: number;
    })[]>;
    findDesignadosParaAluno(alunoId: number): Promise<({
        professor: {
            id: number;
            email: string;
            nome: string;
        };
        exercicio: {
            id: number;
            nome: string;
            ativo: boolean;
            createdAt: Date;
            descricao: string | null;
            modalidade: string;
            fundamento: string;
            subFundamento: string | null;
            criadoPor: number;
        };
    } & {
        id: number;
        createdAt: Date;
        exercicioId: number;
        alunoId: number;
        tipoOrientacao: string | null;
        valorOrientacao: number | null;
        status: string;
        professorId: number;
    })[]>;
    findDesignadosPorProfessor(user: Usuario): Promise<({
        aluno: {
            id: number;
            email: string;
            nome: string;
            fotoPerfil: string | null;
        };
        exercicio: {
            id: number;
            nome: string;
            ativo: boolean;
            createdAt: Date;
            descricao: string | null;
            modalidade: string;
            fundamento: string;
            subFundamento: string | null;
            criadoPor: number;
        };
    } & {
        id: number;
        createdAt: Date;
        exercicioId: number;
        alunoId: number;
        tipoOrientacao: string | null;
        valorOrientacao: number | null;
        status: string;
        professorId: number;
    })[]>;
    findOne(id: number): Promise<{
        criador: {
            id: number;
            email: string;
            nome: string;
        };
        designacoes: ({
            aluno: {
                id: number;
                email: string;
                nome: string;
            };
        } & {
            id: number;
            createdAt: Date;
            exercicioId: number;
            alunoId: number;
            tipoOrientacao: string | null;
            valorOrientacao: number | null;
            status: string;
            professorId: number;
        })[];
    } & {
        id: number;
        nome: string;
        ativo: boolean;
        createdAt: Date;
        descricao: string | null;
        modalidade: string;
        fundamento: string;
        subFundamento: string | null;
        criadoPor: number;
    }>;
    update(id: number, updateExercicioDto: UpdateExercicioDto): Promise<{
        criador: {
            id: number;
            email: string;
            nome: string;
        };
    } & {
        id: number;
        nome: string;
        ativo: boolean;
        createdAt: Date;
        descricao: string | null;
        modalidade: string;
        fundamento: string;
        subFundamento: string | null;
        criadoPor: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    designarExercicio(designarDto: DesignarExercicioDto, user: Usuario): Promise<{
        aluno: {
            id: number;
            email: string;
            nome: string;
        };
        professor: {
            id: number;
            email: string;
            nome: string;
        };
        exercicio: {
            id: number;
            nome: string;
            ativo: boolean;
            createdAt: Date;
            descricao: string | null;
            modalidade: string;
            fundamento: string;
            subFundamento: string | null;
            criadoPor: number;
        };
    } & {
        id: number;
        createdAt: Date;
        exercicioId: number;
        alunoId: number;
        tipoOrientacao: string | null;
        valorOrientacao: number | null;
        status: string;
        professorId: number;
    }>;
}
