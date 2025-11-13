import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TreinosService } from './treinos.service';
import { ConcluirTreinoDto } from './dto/concluir-treino.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { Usuario } from '@prisma/client';

@ApiTags('treinos')
@Controller('treinos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TreinosController {
  constructor(private readonly treinosService: TreinosService) {}

  @Get('meus-treinos')
  @ApiOperation({ summary: 'Listar meus treinos (todos)' })
  getMeusTreinos(@CurrentUser() user: Usuario) {
    return this.treinosService.getMeusTreinos(user.id);
  }

  @Get('pendentes')
  @ApiOperation({ summary: 'Listar treinos pendentes' })
  getTreinosPendentes(@CurrentUser() user: Usuario) {
    return this.treinosService.getTreinosPendentes(user.id);
  }

  @Get('concluidos')
  @ApiOperation({ summary: 'Listar treinos concluídos' })
  getTreinosConcluidos(@CurrentUser() user: Usuario) {
    return this.treinosService.getTreinosConcluidos(user.id);
  }

  @Post('concluir')
  @ApiOperation({ summary: 'Marcar treino como concluído' })
  concluirTreino(
    @Body() concluirTreinoDto: ConcluirTreinoDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.treinosService.concluirTreino(concluirTreinoDto, user.id);
  }

  @Get('historico')
  @ApiOperation({ summary: 'Listar histórico completo de treinos' })
  getHistorico(@CurrentUser() user: Usuario) {
    return this.treinosService.getHistorico(user.id);
  }

  @Get('historico/:exercicioDesignadoId')
  @ApiOperation({ summary: 'Listar histórico de um exercício específico' })
  getHistoricoPorExercicio(
    @Param('exercicioDesignadoId', ParseIntPipe) exercicioDesignadoId: number,
    @CurrentUser() user: Usuario,
  ) {
    return this.treinosService.getHistoricoPorExercicio(
      exercicioDesignadoId,
      user.id,
    );
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas de treinos do aluno' })
  getEstatisticas(@CurrentUser() user: Usuario) {
    return this.treinosService.getEstatisticas(user.id);
  }
}
