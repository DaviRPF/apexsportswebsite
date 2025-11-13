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
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TipoUsuario } from '@prisma/client';

@ApiTags('usuarios')
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm)
  @ApiOperation({ summary: 'Criar novo usuário (apenas admin/professoradm)' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm, TipoUsuario.professor)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiQuery({ name: 'tipo', enum: TipoUsuario, required: false })
  findAll(@Query('tipo') tipo?: TipoUsuario) {
    return this.usuariosService.findAll(tipo);
  }

  @Get('alunos')
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm, TipoUsuario.professor)
  @ApiOperation({ summary: 'Listar apenas alunos' })
  findAlunos() {
    return this.usuariosService.findAlunos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm)
  @ApiOperation({ summary: 'Atualizar usuário (apenas admin/professoradm)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Patch(':id/foto')
  @ApiOperation({ summary: 'Atualizar foto de perfil' })
  updateFotoPerfil(
    @Param('id', ParseIntPipe) id: number,
    @Body('fotoUrl') fotoUrl: string,
  ) {
    return this.usuariosService.updateFotoPerfil(id, fotoUrl);
  }

  @Delete(':id')
  @Roles(TipoUsuario.admin, TipoUsuario.professoradm)
  @ApiOperation({ summary: 'Desativar usuário (apenas admin/professoradm)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}
