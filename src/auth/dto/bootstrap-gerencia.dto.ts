import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BootstrapGerenciaDto {
  @ApiProperty({ example: 'admin@clinica.com' })
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({ minLength: 32, writeOnly: true })
  @IsString()
  @MinLength(32, { message: 'El código de configuración no es válido' })
  setupToken: string;
}
