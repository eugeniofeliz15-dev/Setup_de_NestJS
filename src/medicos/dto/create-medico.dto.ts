import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicoDto {
  @ApiProperty({ example: 'Roberto', description: 'Nombre del médico' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @ApiProperty({ example: 'Gómez', description: 'Apellido del médico' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @ApiProperty({ example: 'roberto@clinica.com', description: 'Correo electrónico' })
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @ApiProperty({ example: 1, description: 'ID de la especialidad' })
  @IsNumber({}, { message: 'El ID de especialidad debe ser un número' })
  specialtyId: number;
}