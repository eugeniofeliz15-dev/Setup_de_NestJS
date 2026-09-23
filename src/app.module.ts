import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { MedicosModule } from './medicos/medicos.module';
import { CitasModule } from './citas/citas.module';
import { AuthModule } from './auth/auth.module'; // ← AGREGA ESTA LÍNEA

@Module({
  imports: [
    PrismaModule,
    PacientesModule,
    MedicosModule,
    CitasModule,
    AuthModule, // ← AGREGA ESTA LÍNEA TAMBIÉN
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}