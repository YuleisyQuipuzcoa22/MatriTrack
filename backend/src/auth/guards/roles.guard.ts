import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../../enums/RolUsuario';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<RolUsuario[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return true; // Si no hay roles requeridos, permite acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.rol) {
      throw new ForbiddenException('No hay información de usuario para verificar el rol');
    }

    const hasRole = requiredRoles.includes(user.rol);
    
    if (!hasRole) {
      throw new ForbiddenException('Acceso denegado. Rol insuficiente');
    }

    return true;
  }
}