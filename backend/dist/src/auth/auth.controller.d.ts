import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Usuario } from '@prisma/client';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<import("./dto/auth-response.dto").AuthResponseDto>;
    me(user: Usuario): Promise<{
        id: number;
        email: string;
        nome: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        fotoPerfil: string | null;
    } | null>;
}
