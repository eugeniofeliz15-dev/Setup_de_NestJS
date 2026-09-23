import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {
 
  @ApiPropertyOptional() firstName?: string;
  @ApiPropertyOptional() lastName?: string;
  @ApiPropertyOptional() email?: string;
  @ApiPropertyOptional() phone?: string;
  @ApiPropertyOptional() birthDate?: string;
}