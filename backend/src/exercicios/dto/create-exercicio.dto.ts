import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExercicioDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty()
  @IsString()
  modalidade: string;

  @ApiProperty()
  @IsString()
  fundamento: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subFundamento?: string;
}
