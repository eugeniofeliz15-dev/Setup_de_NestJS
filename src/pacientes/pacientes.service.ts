import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.patient.findMany();
  }
}