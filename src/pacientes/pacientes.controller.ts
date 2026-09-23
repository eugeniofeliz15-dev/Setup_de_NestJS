import {
  Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Pacientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA')
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @ApiOperation({ summary: 'Lista todos los pacientes' })
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene un paciente por su ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Crea un nuevo paciente' })
  @ApiBody({ type: CreatePacienteDto })
  @Post()
  create(@Body() dto: CreatePacienteDto) {
    return this.pacientesService.create(dto);
  }

  @ApiOperation({ summary: 'Actualiza un paciente existente' })
  @ApiBody({ type: UpdatePacienteDto })
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePacienteDto) {
    return this.pacientesService.update(Number(id), dto);
  }

  @ApiOperation({ summary: 'Elimina un paciente por su ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(Number(id));
  }
}