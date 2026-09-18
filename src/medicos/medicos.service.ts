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

  update(id: number, data: UpdateMedicoDto) {
    return this.prisma.doctor.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.doctor.delete({ where: { id } });
  }
}