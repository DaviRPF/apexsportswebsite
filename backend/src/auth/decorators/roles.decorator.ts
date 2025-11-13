import { SetMetadata } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

export const Roles = (...roles: TipoUsuario[]) => SetMetadata('roles', roles);
