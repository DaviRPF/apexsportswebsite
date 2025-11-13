import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: {
    id: number;
    nome: string;
    email: string;
    tipo: string;
    fotoPerfil?: string;
  };
}
