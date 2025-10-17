import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../app/features/UsuarioObstetra/services/auth.service';


export const roleGuard: (allowedRoles: string[]) => CanActivateFn = (allowedRoles: string[]) => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getRole();

    if (!userRole) {
      console.warn('No hay rol de usuario. Redirigiendo al login...');
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(userRole)) {
      return true; // Rol permitido
    }

    // Rol insuficiente
    //este aparece en la consola del navegador
    console.warn(`Acceso denegado. Rol requerido: ${allowedRoles.join(', ')}. Rol actual: ${userRole}`);
    router.navigate(['/no-autorizado']); // Opcional: crear página de acceso denegado
    return false;
  };
};