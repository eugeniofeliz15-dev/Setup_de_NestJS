import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMedicoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @IsNumber({}, { message: 'El ID de especialidad debe ser un número' })
  specialtyId: number;
}