import { IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCitaDto {
  @ApiProperty({ example: 1, description: 'ID del paciente' })
  @IsNumber({}, { message: 'El ID del paciente debe ser un número' })
  pacienteId: number;

  @ApiProperty({ example: 1, description: 'ID del médico' })
  @IsNumber({}, { message: 'El ID del médico debe ser un número' })
  doctorId: number;

  @ApiProperty({ example: '2026-09-25T10:00:00.000Z', description: 'Fecha y hora de la cita (ISO 8601)' })
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  scheduledAt: string;

  @ApiPropertyOptional({ example: 'Consulta de rutina', description: 'Notas de la cita' })
  @IsString()
  @IsOptional()
  notes?: string;
}