import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PacientesService } from '../pacientes/pacientes.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { HistorialCitasQueryDto } from './dto/historial-citas-query.dto';

@Injectable()
export class CitasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pacientesService: PacientesService
  ) {}

  async create(data: CreateCitaDto) {
    const paciente = await this.pacientesService.findOne(data.pacienteId);
    if (!paciente) {
      throw new NotFoundException('El paciente no existe');
    }

    return this.prisma.appointment.create({
      data: {
        patientId: data.pacienteId,
        doctorId: data.doctorId,
        scheduledAt: new Date(data.scheduledAt),
        notes: data.notes,
        status: 'SCHEDULED'
      }
    });
  }

  findAll() {
    return this.prisma.appointment.findMany();
  }

  async findPaginated(query: HistorialCitasQueryDto) {
    const where = query.estado ? { status: query.estado } : {};
    const skip = (query.pagina - 1) * query.limite;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: query.limite,
        orderBy: [{ scheduledAt: 'desc' }, { id: 'desc' }],
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data,
      total,
      pagina: query.pagina,
      totalPaginas: Math.ceil(total / query.limite),
    };
  }
}