import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';

@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Get()
  findAll() {
    return this.medicosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const medico = await this.medicosService.findOne(Number(id));
    if (!medico) {
      throw new NotFoundException(`Médico con ID ${id} no encontrado`);
    }
    return medico;
  }

  @Post()
  create(@Body() dto: CreateMedicoDto) {
    return this.medicosService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMedicoDto) {
    try {
      return await this.medicosService.update(Number(id), dto);
    } catch (error) {
      throw new NotFoundException(`Médico con ID ${id} no encontrado`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.medicosService.remove(Number(id));
    } catch (error) {
      throw new NotFoundException(`Médico con ID ${id} no encontrado`);
    }
  }
}