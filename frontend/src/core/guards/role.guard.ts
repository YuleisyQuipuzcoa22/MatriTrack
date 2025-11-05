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

    // --- INICIO DE LA MODIFICACIÓN (ROBUSTEZ) ---
    
    // 1. Limpia el rol del usuario: quita espacios y convierte a minúsculas.
    const userRoleClean = userRole.trim().toLowerCase();
    
    // 2. Compara contra la lista de roles permitidos (también limpiada).
    const isAllowed = allowedRoles
      .map(role => role.trim().toLowerCase()) // Limpia también los roles de la ruta
      .includes(userRoleClean);

    if (isAllowed) {
      return true; // Rol permitido
    }
    
    // --- FIN DE LA MODIFICACIÓN ---

    // Rol insuficiente
    console.warn(`Acceso denegado. Rol requerido: ${allowedRoles.join(', ')}. Rol actual: "${userRole}"`);
    router.navigate(['/no-autorizado']); 
    return false;
  };
};