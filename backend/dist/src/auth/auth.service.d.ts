import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    me(userId: number): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
    } | null>;
}
