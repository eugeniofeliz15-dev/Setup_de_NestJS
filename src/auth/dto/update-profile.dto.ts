import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Cristian Feliz' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'cris@clinica.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '8095551234' })
  @IsOptional()
  @IsString()
  @ValidateIf((_object, value) => value !== '')
  @Matches(/^\d{8,15}$/)
  telefono?: string;
}
