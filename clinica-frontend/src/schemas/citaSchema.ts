import { z } from 'zod';

export const citaSchema = z.object({
  pacienteNombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  medicoId: z.string().min(1, "Debes seleccionar un médico"),
  fecha: z.string().min(1, "La fecha es obligatoria").refine((val) => {
    const hoy = new Date().toISOString().split('T')[0];
    return val >= hoy;
  }, "La fecha no puede ser en el pasado"),
  hora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:MM)"),
  motivo: z.string().min(10, "El motivo debe tener al menos 10 caracteres").max(500, "Máximo 500 caracteres"),
  urgencia: z.enum(['baja', 'media', 'alta', 'critica']),
});

export type CitaFormData = z.infer<typeof citaSchema>;