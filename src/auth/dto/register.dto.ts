import { IsString, IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'recepcion@clinica.com', description: 'Correo electrónico' })
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @ApiProperty({ example: 'RECEPCIONISTA', enum: ['RECEPCIONISTA', 'ADMIN', 'DOCTOR'] })
  @IsIn(['RECEPCIONISTA', 'ADMIN', 'DOCTOR'], {
    message: 'El rol debe ser RECEPCIONISTA, ADMIN o DOCTOR'
  })
  role: string;
}