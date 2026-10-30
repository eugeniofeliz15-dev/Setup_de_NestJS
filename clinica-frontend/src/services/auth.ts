import { api } from '../lib/axios';
import type { LoginFormData } from '../schemas/loginSchema';

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    telefono: string | null;
    foto: string | null;
  };
}

export async function login(datos: LoginFormData): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', datos);
  return data;
}

export async function actualizarPerfil(datos: FormData): Promise<LoginResponse['usuario']> {
  const { data } = await api.patch<LoginResponse['usuario']>('/auth/profile', datos, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}