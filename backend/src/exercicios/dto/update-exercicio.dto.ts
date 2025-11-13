import { PartialType } from '@nestjs/swagger';
import { CreateExercicioDto } from './create-exercicio.dto';

export class UpdateExercicioDto extends PartialType(CreateExercicioDto) {}
