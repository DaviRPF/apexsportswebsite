import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        id: number;
        email: string;
        nome: string;
        senha: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
