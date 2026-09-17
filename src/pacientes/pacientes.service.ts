import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.patient.findMany();
  }

  async findOne(id: number) {
    const paciente = await this.prisma.patient.findUnique({ where: { id } });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  create(data: CreatePacienteDto) {
    // Validación de fecha no futura
    if (new Date(data.birthDate) > new Date()) {
      throw new BadRequestException('La fecha de nacimiento no puede ser futura');
    }
    return this.prisma.patient.create({ data });
  }

  async update(id: number, data: UpdatePacienteDto) {
    // Validación de fecha no futura si se está actualizando
    if (data.birthDate && new Date(data.birthDate) > new Date()) {
      throw new BadRequestException('La fecha de nacimiento no puede ser futura');
    }
    
    try {
      return await this.prisma.patient.update({ where: { id }, data });
    } catch (error) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.patient.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
  }
}