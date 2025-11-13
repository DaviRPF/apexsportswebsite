import { IsInt, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConcluirTreinoDto {
  @ApiProperty()
  @IsInt()
  exercicioDesignadoId: number;

  @ApiProperty()
  @IsString()
  @IsIn(['tempo', 'repeticao'])
  tipoRealizado: string;

  @ApiProperty()
  @IsInt()
  valorRealizado: number;
}
