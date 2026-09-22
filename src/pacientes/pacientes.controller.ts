import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}
  
  @Get() findAll() { return this.pacientesService.findAll(); }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(Number(id));
  }

  @Post() create(@Body() dto: CreatePacienteDto) { return this.pacientesService.create(dto); }

  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdatePacienteDto) { 
    return this.pacientesService.update(Number(id), dto); 
  }

  @Delete(':id') remove(@Param('id') id: string) { return this.pacientesService.remove(Number(id)); }
}