import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExerciciosService } from './exercicios.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';
import { DesignarExercicioDto } from './dto/designar-exercicio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TipoUsuario } from '@prisma/client';
import type { Usuario } from '@prisma/client';

@ApiTags('exercicios')
@Controller('exercicios')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExerciciosController {
  constructor(private readonly exerciciosService: ExerciciosService) {}

  @Post()
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm, TipoUsuario.professor)
  @ApiOperation({ summary: 'Criar novo exercício' })
  create(
    @Body() createExercicioDto: CreateExercicioDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.exerciciosService.create(createExercicioDto, user.id);
  }

  @Get()
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm, TipoUsuario.professor)
  @ApiOperation({ summary: 'Listar todos os exercícios' })
  @ApiQuery({ name: 'modalidade', required: false })
  findAll(@Query('modalidade') modalidade?: string) {
    return this.exerciciosService.findAll(modalidade);
  }

  @Get('designados/aluno/:alunoId')
  @ApiOperation({ summary: 'Listar exercícios designados para um aluno' })
  findDesignadosParaAluno(@Param('alunoId', ParseIntPipe) alunoId: number) {
    return this.exerciciosService.findDesignadosParaAluno(alunoId);
  }

  @Get('designados/professor')
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm, TipoUsuario.professor)
  @ApiOperation({ summary: 'Listar exercícios designados pelo professor logado' })
  findDesignadosPorProfessor(@CurrentUser() user: Usuario) {
    return this.exerciciosService.findDesignadosPorProfessor(user.id);
  }

  @Get(':id')
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm, TipoUsuario.professor)
  @ApiOperation({ summary: 'Buscar exercício por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exerciciosService.findOne(id);
  }

  @Patch(':id')
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm, TipoUsuario.professor)
  @ApiOperation({ summary: 'Atualizar exercício' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExercicioDto: UpdateExercicioDto,
  ) {
    return this.exerciciosService.update(id, updateExercicioDto);
  }

  @Delete(':id')
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm)
  @ApiOperation({ summary: 'Desativar exercício' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exerciciosService.remove(id);
  }

  @Post('designar')
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm, TipoUsuario.professor)
  @ApiOperation({ summary: 'Designar exercício para um aluno' })
  designarExercicio(
    @Body() designarDto: DesignarExercicioDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.exerciciosService.designarExercicio(designarDto, user.id);
  }
}
