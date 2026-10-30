import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { AppointmentStatus } from '../../../generated/prisma';

export class HistorialCitasQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limite = 10;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  estado?: AppointmentStatus;
}
