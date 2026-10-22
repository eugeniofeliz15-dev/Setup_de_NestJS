import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {
  @ApiPropertyOptional() firstName?: string;
  @ApiPropertyOptional() lastName?: string;
  @ApiPropertyOptional() email?: string;
  @ApiPropertyOptional() phone?: string;
  @ApiPropertyOptional() birthDate?: string;
  

  @ApiPropertyOptional({ enum: ['activo', 'inactivo', 'en_espera'] })
  estado?: 'activo' | 'inactivo' | 'en_espera';
}