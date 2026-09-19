import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { MedicosModule } from './medicos/medicos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, PacientesModule, MedicosModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}