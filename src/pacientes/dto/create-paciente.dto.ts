import { IsString, IsEmail, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePacienteDto {
  @ApiProperty({ example: 'Ana', description: 'Nombre del paciente' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @ApiProperty({ example: 'García', description: 'Apellido del paciente' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @ApiProperty({ example: 'ana@mail.com', description: 'Correo electrónico' })
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @ApiProperty({ example: '8091234567', description: 'Teléfono del paciente' })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  phone: string;

  @ApiProperty({ example: '1990-01-01', description: 'Fecha de nacimiento (ISO 8601)' })
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida' })
  birthDate: string;
}