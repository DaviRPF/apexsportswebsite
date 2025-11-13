import { Module } from '@nestjs/common';
import { TreinosService } from './treinos.service';
import { TreinosController } from './treinos.controller';

@Module({
  controllers: [TreinosController],
  providers: [TreinosService],
  exports: [TreinosService],
})
export class TreinosModule {}
