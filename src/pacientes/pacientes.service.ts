import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() { return this.prisma.patient.findMany(); }

  async findOne(id: number) {
    const paciente = await this.prisma.patient.findUnique({ where: { id } });
    if (!paciente) throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    return paciente;
  }

  create(data: CreatePacienteDto) {
    if (new Date(data.birthDate) > new Date()) {
      throw new BadRequestException('La fecha de nacimiento no puede ser futura');
    }
    return this.prisma.patient.create({ data });
  }

  update(id: number, data: UpdatePacienteDto) {
    if (data.birthDate && new Date(data.birthDate) > new Date()) {
      throw new BadRequestException('La fecha de nacimiento no puede ser futura');
    }
    return this.prisma.patient.update({ where: { id }, data });
  }

  remove(id: number) { return this.prisma.patient.delete({ where: { id } }); }
}