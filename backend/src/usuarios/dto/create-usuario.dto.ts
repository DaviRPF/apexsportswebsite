import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoUsuario } from '@prisma/client';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({ enum: TipoUsuario })
  @IsEnum(TipoUsuario)
  tipo: TipoUsuario;
}
