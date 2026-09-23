import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicoDto } from './create-medico.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMedicoDto extends PartialType(CreateMedicoDto) {
  @ApiPropertyOptional() firstName?: string;
  @ApiPropertyOptional() lastName?: string;
  @ApiPropertyOptional() email?: string;
  @ApiPropertyOptional() specialtyId?: number;
}