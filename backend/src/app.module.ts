import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ExerciciosModule } from './exercicios/exercicios.module';
import { TreinosModule } from './treinos/treinos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    ExerciciosModule,
    TreinosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
