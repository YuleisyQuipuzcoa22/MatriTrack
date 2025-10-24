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
import { ListadoHistorialmedico } from './features/HistorialMedico/pages/listado-historialmedico/listado-historialmedico';
import { CrearPacienteHistorial } from './features/Paciente/pages/crear-paciente-historial/crear-paciente-historial';
import { EditarPaciente } from './features/Paciente/pages/editar-paciente/editar-paciente';
import { ProgramaDiagnosticoListComponent } from './features/ProgramaDiagnostico/pages/programa-diagnostico-list.component/programa-diagnostico-list.component';
import { RegistroProgramaDiagnosticoComponent } from './features/ProgramaDiagnostico/pages/registro-programa-diagnostico.component/registro-programa-diagnostico.component';

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
  {
    path: 'pacientes/registrar',
    component: CrearPacienteHistorial,
    canActivate: [authGuard], // Requiere estar logueado
  },
  {
    path: 'pacientes/editar/:id',
    component: EditarPaciente,
    canActivate: [authGuard], // Requiere estar logueado
  },
   {
    path: 'historialmedico',
    component: ListadoHistorialmedico,
    canActivate: [authGuard], // Requiere estar logueado
  },

{
    path: 'diagnostico',
    component: ProgramaDiagnosticoListComponent, // Listado de programas
    canActivate: [authGuard], 
  },
  {
    // Ruta para CREAR: Requiere el ID del historial médico para saber a qué paciente se asigna
    path: 'diagnostico/registrar', 
    component: RegistroProgramaDiagnosticoComponent,
    canActivate: [authGuard],
  },
  {
    // Ruta para EDITAR: Requiere el ID del programa diagnóstico
    path: 'diagnostico/editar/:id', 
    component: RegistroProgramaDiagnosticoComponent, // Reutiliza el componente
    canActivate: [authGuard],
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
