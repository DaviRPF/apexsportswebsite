import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'apex-sports-jwt-secret-change-in-production',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub, ativo: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
