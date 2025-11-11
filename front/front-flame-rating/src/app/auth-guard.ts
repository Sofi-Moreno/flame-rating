import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../app/service/auth';
import { map } from 'rxjs/operators';
import { User } from '../app/model/user';

// -----------------------------------------------------------------------
// 1. Guard de Autenticación (Usuario Logueado)
// -----------------------------------------------------------------------
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Escuchamos el estado actual del usuario (BehaviorSubject)
  return authService.currentUser.pipe(
    map(user => {
      if (user) {
        // Usuario logueado: Permitir acceso
        return true;
      } else {
        // Usuario NO logueado: Redirigir al login
        return router.createUrlTree(['/login-register']);
      }
    })
  );
};


// -----------------------------------------------------------------------
// 2. Guard de Rol (Solo para Administradores)
// -----------------------------------------------------------------------
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser.pipe(
    map((user: User | null) => {
      // 1. Verificar que el usuario exista
      if (user) {
        // 2. Verificar el rol isAdmin
        if (user.isAdmin) {
          return true; // Es Admin: Permitir acceso
        } else {
          // No es Admin: Redirigir a una página de acceso denegado o al home
          // Requerirá una ruta de 'access-denied' o similar
          alert("Acceso Denegado: Se requiere rol de Administrador.");
          return router.createUrlTree(['/']); 
        }
      } else {
        // No logueado: Redirigir al login
        return router.createUrlTree(['/login-register']);
      }
    })
  );
};