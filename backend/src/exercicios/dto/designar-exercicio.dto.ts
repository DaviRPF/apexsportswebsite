import { IsInt, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DesignarExercicioDto {
  @ApiProperty()
  @IsInt()
  exercicioId: number;

  @ApiProperty()
  @IsInt()
  alunoId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['tempo', 'repeticao'])
  tipoOrientacao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  valorOrientacao?: number;
}
