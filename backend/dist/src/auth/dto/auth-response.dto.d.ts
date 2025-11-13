export declare class AuthResponseDto {
    access_token: string;
    user: {
        id: number;
        nome: string;
        email: string;
        tipo: string;
        fotoPerfil?: string;
    };
}
