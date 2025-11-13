import { TipoUsuario } from '@prisma/client';
export declare class CreateUsuarioDto {
    nome: string;
    email: string;
    senha: string;
    tipo: TipoUsuario;
}
