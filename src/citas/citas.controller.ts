import { Controller, Get, Post, Body } from '@nestjs/common';
import { CitasService } from './citas.service';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  create(@Body() body: { pacienteId: number; doctorId: number; scheduledAt: string; notes?: string }) {

    return this.citasService.create({
      pacienteId: body.pacienteId,
      doctorId: body.doctorId,
      scheduledAt: new Date(body.scheduledAt),
      notes: body.notes
    });
  }

  @Get()
  findAll() {
    return this.citasService.findAll();
  }
}