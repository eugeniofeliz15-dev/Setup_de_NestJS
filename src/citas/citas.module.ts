import { Module } from '@nestjs/common';
import { CitasController } from './citas.controller';
import { CitasService } from './citas.service';
import { PacientesModule } from '../pacientes/pacientes.module'; 

@Module({
  imports: [PacientesModule], 
  controllers: [CitasController],
  providers: [CitasService]
})
export class CitasModule {}