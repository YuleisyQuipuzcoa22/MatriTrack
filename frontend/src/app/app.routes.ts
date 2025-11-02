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
import { ProgramaDiagnosticoListComponent } from './features/ProgramaDiagnostico/pages/programa-diagnostico-list.component/list-programadiagnostico';

import { ListarProgramapuerperio } from './features/Puerperio/ProgramaPuerperio/Pages/listar-programapuerperio/listar-programapuerperio';
import { CrearEditarProgramapuerperio } from './features/Puerperio/ProgramaPuerperio/Pages/crear-editar-programapuerperio/crear-editar-programapuerperio';
import { ListarControlpuerperio } from './features/Puerperio/ControlPuerperio/Pages/listar-controlpuerperio/listar-controlpuerperio';
import { CrearEditarControlpuerperio } from './features/Puerperio/ControlPuerperio/Pages/crear-editar-controlpuerperio/crear-editar-controlpuerperio';

import { AgregarDetalleAnalisis } from './features/DetalleAnalisis/agregar-detalle-analisis/agregar-detalle-analisis';
import { EditarDetalleAnalisis } from './features/DetalleAnalisis/editar-detalle-analisis/editar-detalle-analisis';
import { ListarDetalleAnalisis } from './features/DetalleAnalisis/listar-detalles-analisis/listar-detalles-analisis';
import { ConsultaVerDetalles } from './features/DetalleAnalisis/consulta-ver-detalles/consulta-ver-detalles';
import { ProgramasHistorialmedico } from './features/HistorialMedico/pages/programas-historialmedico/programas-historialmedico';
import { CrearEditarProgDiagnostico } from './features/ProgramaDiagnostico/pages/crear-editar-prog-diagnostico/crear-editar-prog-diagnostico';

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
    component: CrearEditarProgDiagnostico,
    canActivate: [authGuard],
  },
  {
    // Ruta para EDITAR: Requiere el ID del programa diagnóstico
    path: 'diagnostico/editar/:id',
    component: CrearEditarProgDiagnostico, // Reutiliza el componente
    canActivate: [authGuard],
  },
   {
    // Ruta para EDITAR: Requiere el ID del programa diagnóstico
    path: 'diagnostico/:id/finalizar',
    component: ProgramaDiagnosticoListComponent, // Reutiliza el componente
    canActivate: [authGuard],
  },
  {
    path: 'puerperio',
    component: ListarProgramapuerperio,
    canActivate: [authGuard], // Requiere estar logueado
  },

  {
    path: 'puerperio/crear',
    component: CrearEditarProgramapuerperio,
    canActivate: [authGuard], // Requiere estar logueado
  },

  {
    path: 'puerperio/editar/:id',
    component: CrearEditarProgramapuerperio,
    canActivate: [authGuard], // Requiere estar logueado
  },

  {
    path: 'puerperio/:id/controles',
    component: ListarControlpuerperio,
    canActivate: [authGuard], // Requiere estar logueado
  },

  {
    path: 'puerperio/:id/controles/crear',
    component: CrearEditarControlpuerperio,
    canActivate: [authGuard], // Requiere estar logueado
  },

  {
    path: 'puerperio/:id/controles/editar/:cid',
    component: CrearEditarControlpuerperio,
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

  //Detalle Analisis
  // La ruta estática 'registrar' debe ir antes que la ruta con parámetro ':id'
  { path: 'detalle-analisis/registrar', component: AgregarDetalleAnalisis },
  // ruta para ver/editar un detalle por id
  { path: 'detalle-analisis/:id', component: EditarDetalleAnalisis },
  //detalles analisis
  { path: 'detalles-analisis/:id', component: ListarDetalleAnalisis },
  //consulta detalles de un analisis
  { path: 'consulta-detalles-analisis/:id', component: ConsultaVerDetalles },

  // --- NUEVAS RUTAS PARA HISTORIAL MÉDICO ---
  {
    path: 'historialmedico/:id/programas', // Ruta para ver los programas de UN historial (:id es el ID del historial)
    component: ProgramasHistorialmedico,
    canActivate: [authGuard], // Asumiendo que requiere login
  },
  // --- FIN NUEVAS RUTAS ---

  //no autorizado
  { path: 'no-autorizado', component: NoAutorizado },

  // Página 404 (debe ir al final)
  { path: '**', component: Notfound },
];
