import {
  Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Médicos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA')
@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @ApiOperation({ summary: 'Lista todos los médicos' })
  @Get()
  findAll() { return this.medicosService.findAll(); }

  @ApiOperation({ summary: 'Obtiene un médico por su ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicosService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Crea un nuevo médico' })
  @ApiBody({ type: CreateMedicoDto })
  @Post()
  create(@Body() dto: CreateMedicoDto) {
    return this.medicosService.create(dto);
  }

  @ApiOperation({ summary: 'Actualiza un médico existente' })
  @ApiBody({ type: UpdateMedicoDto })
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMedicoDto) {
    return this.medicosService.update(Number(id), dto);
  }

  @ApiOperation({ summary: 'Elimina un médico por su ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicosService.remove(Number(id));
  }
}