import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';

@Injectable()
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.doctor.findMany();
  }

  async findOne(id: number) {
    const medico = await this.prisma.doctor.findUnique({ where: { id } });
    if (!medico) {
      throw new NotFoundException(`Médico con ID ${id} no encontrado`);
    }
    return medico;
  }

  create(data: CreateMedicoDto) {
    return this.prisma.doctor.create({ data });
  }

  async update(id: number, data: UpdateMedicoDto) {
    try {
      return await this.prisma.doctor.update({ where: { id }, data });
    } catch (error) {
      throw new NotFoundException(`Médico con ID ${id} no encontrado`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.doctor.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Médico con ID ${id} no encontrado`);
    }
  }
}