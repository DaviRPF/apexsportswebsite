import { PrismaService } from '../database/prisma.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';
import { DesignarExercicioDto } from './dto/designar-exercicio.dto';
export declare class ExerciciosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createExercicioDto: CreateExercicioDto, criadoPor: number): Promise<{
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
    designarExercicio(designarDto: DesignarExercicioDto, professorId: number): Promise<{
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
    findDesignadosPorProfessor(professorId: number): Promise<({
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
}
