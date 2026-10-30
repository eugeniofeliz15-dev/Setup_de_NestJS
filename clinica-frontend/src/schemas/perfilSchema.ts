import { z } from 'zod';

export const perfilSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  // Acepta string vacío o 8-15 dígitos
  telefono: z.string().regex(/^\d{8,15}$/, 'Ingresa un teléfono válido (8-15 dígitos)').optional().or(z.literal('')),
});

export type PerfilFormData = z.infer<typeof perfilSchema>;