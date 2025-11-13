import { Module } from '@nestjs/common';
import { ExerciciosService } from './exercicios.service';
import { ExerciciosController } from './exercicios.controller';

@Module({
  controllers: [ExerciciosController],
  providers: [ExerciciosService],
  exports: [ExerciciosService],
})
export class ExerciciosModule {}
