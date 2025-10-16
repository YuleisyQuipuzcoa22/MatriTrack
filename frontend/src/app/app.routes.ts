import { Routes } from '@angular/router';
import { Login } from './features/UsuarioObstetra/pages/login/login';
import { RegisterEditarUser } from './features/UsuarioObstetra/pages/crear&editar-obstetra/registerEditar-user';
import { Notfound } from './components/notfound/notfound';
import { ListadoPacientes } from './features/Paciente/pages/listado-pacientes/listado-pacientes';
import { ListadoObstetras } from './features/UsuarioObstetra/pages/listado-obstetras/listado-obstetras';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';
import { NoAutorizado } from './components/no-autorizado/no-autorizado';
import { ListadoAnalisis } from './features/Analisis/pages/listado-analisis/listado-analisis';

export const routes: Routes = [
  // Redirige al login por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Ruta pública (login)
  { path: 'login', component: Login },

  // Rutas protegidas (requieren autenticación)
  {
    path: 'pacientes',
    component: ListadoPacientes,
    canActivate: [authGuard], // Requiere estar logueado
  },

  // Rutas protegidas (solo Administrador)
  {
    path: 'obstetras',
    component: ListadoObstetras,
    canActivate: [authGuard, roleGuard(['Administrador'])], // Requiere login + rol Admin
  },
  {
    path: 'obstetras/registrar',
    component: RegisterEditarUser,
    canActivate: [authGuard, roleGuard(['Administrador'])],
  },
  {
    path: 'obstetras/editar/:id',
    component: RegisterEditarUser,
    canActivate: [authGuard, roleGuard(['Administrador'])],
  },
   {
    path: 'analisis',
    component: ListadoAnalisis,
    canActivate: [authGuard, roleGuard(['Administrador'])],
  },

  //no autorizado
  { path: 'no-autorizado', component: NoAutorizado },

  // Página 404 (debe ir al final)
  { path: '**', component: Notfound },
];
