import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('medicos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Get() findAll() { return this.medicosService.findAll(); }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicosService.findOne(Number(id));
  }

  @Post() create(@Body() dto: CreateMedicoDto) { return this.medicosService.create(dto); }

  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateMedicoDto) { 
    return this.medicosService.update(Number(id), dto); 
  }

  @Delete(':id') remove(@Param('id') id: string) { return this.medicosService.remove(Number(id)); }
}