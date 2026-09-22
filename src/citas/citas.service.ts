import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PacientesService } from '../pacientes/pacientes.service';

@Injectable()
export class CitasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pacientesService: PacientesService
  ) {}

  async create(data: { pacienteId: number; doctorId: number; scheduledAt: Date; notes?: string }) {
    const paciente = await this.pacientesService.findOne(data.pacienteId);
    if (!paciente) {
      throw new NotFoundException('El paciente no existe');
    }

    return this.prisma.appointment.create({
      data: {
        patientId: data.pacienteId,
        doctorId: data.doctorId,
        scheduledAt: data.scheduledAt,
        notes: data.notes,
        status: 'SCHEDULED' 
      }
    });
  }

  findAll() {
    return this.prisma.appointment.findMany();
  }
}