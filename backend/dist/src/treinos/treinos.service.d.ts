import { PrismaService } from '../database/prisma.service';
import { ConcluirTreinoDto } from './dto/concluir-treino.dto';
export declare class TreinosService {
    private prisma;
    constructor(prisma: PrismaService);
    getMeusTreinos(alunoId: number): Promise<({
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
        historico: {
            id: number;
            alunoId: number;
            exercicioDesignadoId: number;
            tipoRealizado: string;
            valorRealizado: number;
            dataConclusao: Date;
        }[];
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
    getTreinosPendentes(alunoId: number): Promise<({
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
    getTreinosConcluidos(alunoId: number): Promise<({
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
        historico: {
            id: number;
            alunoId: number;
            exercicioDesignadoId: number;
            tipoRealizado: string;
            valorRealizado: number;
            dataConclusao: Date;
        }[];
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
    concluirTreino(concluirTreinoDto: ConcluirTreinoDto, alunoId: number): Promise<{
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
        historico: {
            id: number;
            alunoId: number;
            exercicioDesignadoId: number;
            tipoRealizado: string;
            valorRealizado: number;
            dataConclusao: Date;
        }[];
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
    getHistorico(alunoId: number): Promise<({
        exercicioDesignado: {
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
        };
    } & {
        id: number;
        alunoId: number;
        exercicioDesignadoId: number;
        tipoRealizado: string;
        valorRealizado: number;
        dataConclusao: Date;
    })[]>;
    getHistoricoPorExercicio(exercicioDesignadoId: number, alunoId: number): Promise<{
        id: number;
        alunoId: number;
        exercicioDesignadoId: number;
        tipoRealizado: string;
        valorRealizado: number;
        dataConclusao: Date;
    }[]>;
    getEstatisticas(alunoId: number): Promise<{
        totalDesignados: number;
        totalConcluidos: number;
        totalPendentes: number;
        totalTreinos: number;
        treinosUltimos7Dias: number;
        percentualConclusao: number;
    }>;
}
