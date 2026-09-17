import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paciente = await this.pacientesService.findOne(Number(id));
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  @Post()
  create(@Body() dto: CreatePacienteDto) {
    return this.pacientesService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePacienteDto) {
    try {
      return await this.pacientesService.update(Number(id), dto);
    } catch (error) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.pacientesService.remove(Number(id));
    } catch (error) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
  }
}