import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class MedicosService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.doctor.findMany();
    }
}
