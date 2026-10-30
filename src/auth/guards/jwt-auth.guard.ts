import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload & { id: number };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {} // ← Inyectado

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const payload = jwt.verify(
        header.split(' ')[1],
        this.configService.getOrThrow<string>('JWT_SECRET')
      );
      if (typeof payload === 'string' || typeof payload.id !== 'number') {
        throw new UnauthorizedException('Token inválido o expirado');
      }
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}