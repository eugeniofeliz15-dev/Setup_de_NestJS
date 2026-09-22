import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lee los roles requeridos desde el decorador @Roles()
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // Si no hay roles requeridos, permite el acceso
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    
    // Verifica que el usuario exista y que su rol esté en la lista de roles permitidos
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('No tienes permiso para acceder a este recurso');
    }
    
    return true;
  }
}