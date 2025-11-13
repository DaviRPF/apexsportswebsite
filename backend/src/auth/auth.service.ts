import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.usuario.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !user.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(loginDto.senha, user.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        fotoPerfil: user.fotoPerfil || undefined,
      },
    };
  }

  async me(userId: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        fotoPerfil: true,
      },
    });

    return user;
  }
}
