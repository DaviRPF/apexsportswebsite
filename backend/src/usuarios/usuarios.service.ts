import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcryptjs';
import { TipoUsuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);

    const user = await this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        senha: hashedPassword,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        fotoPerfil: true,
        ativo: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findAll(tipo?: TipoUsuario) {
    const where = tipo ? { tipo, ativo: true } : { ativo: true };

    return this.prisma.usuario.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        fotoPerfil: true,
        ativo: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        fotoPerfil: true,
        ativo: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findAlunos() {
    return this.prisma.usuario.findMany({
      where: { tipo: 'aluno', ativo: true },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        fotoPerfil: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUsuarioDto.email && updateUsuarioDto.email !== user.email) {
      const existingUser = await this.prisma.usuario.findUnique({
        where: { email: updateUsuarioDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    const updateData: any = { ...updateUsuarioDto };

    if (updateUsuarioDto.senha) {
      updateData.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        fotoPerfil: true,
        ativo: true,
      },
    });

    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.usuario.update({
      where: { id },
      data: { ativo: false },
    });

    return { message: 'Usuário desativado com sucesso' };
  }

  async updateFotoPerfil(id: number, fotoUrl: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: { fotoPerfil: fotoUrl },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        fotoPerfil: true,
      },
    });

    return updatedUser;
  }
}
