import { PrismaService } from '../database/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { TipoUsuario } from '@prisma/client';
export declare class UsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUsuarioDto: CreateUsuarioDto): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
        ativo: boolean;
        createdAt: Date;
    }>;
    findAll(tipo?: TipoUsuario): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
        ativo: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
        ativo: boolean;
        createdAt: Date;
    }>;
    findAlunos(): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
    }[]>;
    update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
        ativo: boolean;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    updateFotoPerfil(id: number, fotoUrl: string): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
    }>;
}
