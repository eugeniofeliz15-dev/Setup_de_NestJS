import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const bootstrapGerenciaSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  setupToken: z
    .string()
    .min(32, 'Ingresa el código de configuración de Render'),
});

export type BootstrapGerenciaFormData = z.infer<typeof bootstrapGerenciaSchema>;
