import { IsString, IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  // Validamos que el string sea uno de los roles permitidos
  @IsIn(['RECEPCIONISTA', 'ADMIN', 'DOCTOR'], { 
    message: 'El rol debe ser RECEPCIONISTA, ADMIN o DOCTOR' 
  })
  role: string;
}