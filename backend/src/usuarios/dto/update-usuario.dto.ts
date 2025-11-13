import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fotoPerfil?: string;
}
