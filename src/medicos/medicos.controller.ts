import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { MedicosService } from './medicos.service';

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
  create(@Body() body: any) {
    return this.medicosService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      return await this.medicosService.update(Number(id), body);
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