import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Citas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA')
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @ApiOperation({ summary: 'Lista todas las citas' })
  @Get()
  findAll() {
    return this.citasService.findAll();
  }

  @ApiOperation({ summary: 'Crea una nueva cita' })
  @ApiBody({ type: CreateCitaDto })
  @Post()
  create(@Body() dto: CreateCitaDto) {
    return this.citasService.create(dto);
  }
}