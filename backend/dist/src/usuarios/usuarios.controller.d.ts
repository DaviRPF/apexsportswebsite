import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { TipoUsuario } from '@prisma/client';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
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
    findAlunos(): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
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
    update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
        ativo: boolean;
    }>;
    updateFotoPerfil(id: number, fotoUrl: string): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
