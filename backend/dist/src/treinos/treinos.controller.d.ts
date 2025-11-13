import { TreinosService } from './treinos.service';
import { ConcluirTreinoDto } from './dto/concluir-treino.dto';
import type { Usuario } from '@prisma/client';
export declare class TreinosController {
    private readonly treinosService;
    constructor(treinosService: TreinosService);
    getMeusTreinos(user: Usuario): Promise<({
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
    getTreinosPendentes(user: Usuario): Promise<({
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
    getTreinosConcluidos(user: Usuario): Promise<({
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
    concluirTreino(concluirTreinoDto: ConcluirTreinoDto, user: Usuario): Promise<{
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
    getHistorico(user: Usuario): Promise<({
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
    getHistoricoPorExercicio(exercicioDesignadoId: number, user: Usuario): Promise<{
        id: number;
        alunoId: number;
        exercicioDesignadoId: number;
        tipoRealizado: string;
        valorRealizado: number;
        dataConclusao: Date;
    }[]>;
    getEstatisticas(user: Usuario): Promise<{
        totalDesignados: number;
        totalConcluidos: number;
        totalPendentes: number;
        totalTreinos: number;
        treinosUltimos7Dias: number;
        percentualConclusao: number;
    }>;
}
