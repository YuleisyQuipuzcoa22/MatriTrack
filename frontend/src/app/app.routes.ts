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

import { ListarControles } from './features/ControlDiagnostico/pages/listar-controles/listar-controles';
import { CrearEditarControlDiagnostico } from './features/ControlDiagnostico/pages/crear-editar-control/crear-editar-control';
export const routes: Routes = [
  // Redirige al login por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Ruta pública (login)
  { path: 'login', component: Login },

  // --- RUTAS COMUNES (Obstetra y Admin) ---
  {
    path: 'pacientes',
    component: ListadoPacientes,
    canActivate: [authGuard],
  },
  {
    path: 'pacientes/registrar',
    component: CrearPacienteHistorial,
    canActivate: [authGuard],
  },
  {
    path: 'pacientes/editar/:id',
    component: EditarPaciente,
    canActivate: [authGuard],
  },
  {
    path: 'historialmedico',
    component: ListadoHistorialmedico,
    canActivate: [authGuard],
  },
  {
    path: 'historialmedico/paciente/:id_paciente',
    component: ProgramasHistorialmedico,
    canActivate: [authGuard],
  },
  {
    path: 'diagnostico',
    component: ProgramaDiagnosticoListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'diagnostico/registrar',
    component: CrearEditarProgDiagnostico,
    canActivate: [authGuard],
  },
  {
    path: 'diagnostico/editar/:id',
    component: CrearEditarProgDiagnostico,
    canActivate: [authGuard],
  },
  {
    path: 'diagnostico/:id/finalizar',
    component: ProgramaDiagnosticoListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'puerperio',
    component: ListarProgramapuerperio,
    canActivate: [authGuard],
  },
  {
    path: 'puerperio/crear',
    component: CrearEditarProgramapuerperio,
    canActivate: [authGuard],
  },
  {
    path: 'puerperio/editar/:id',
    component: CrearEditarProgramapuerperio,
    canActivate: [authGuard],
  },

  // --- INICIO DE LA CORRECCIÓN ---
  // Rutas que ahora aceptan AMBOS roles (Admin y Obstetra)
  {
    path: 'puerperio/:id/controles',
    component: ListarControlpuerperio,
    canActivate: [authGuard, roleGuard(['Obstetra', 'Administrador'])],
  },
  {
    path: 'puerperio/:id/controles/crear',
    component: CrearEditarControlpuerperio,
    canActivate: [authGuard, roleGuard(['Obstetra', 'Administrador'])],
  },
  {
    path: 'puerperio/:id/controles/editar/:cid',
    component: CrearEditarControlpuerperio,
    canActivate: [authGuard, roleGuard(['Obstetra', 'Administrador'])],
  },
  // (Asumiendo que Admin también debe ver detalles de análisis)
  {
    path: 'detalle-analisis/registrar',
    component: AgregarDetalleAnalisis,
    canActivate: [authGuard, roleGuard(['Obstetra', 'Administrador'])],
  },
  {
    path: 'detalle-analisis/:id',
    component: EditarDetalleAnalisis,
    canActivate: [authGuard, roleGuard(['Obstetra', 'Administrador'])],
  },
  {
    path: 'detalles-analisis/:id',
    component: ListarDetalleAnalisis,
    canActivate: [authGuard, roleGuard(['Obstetra', 'Administrador'])],
  },
  {
    path: 'consulta-detalles-analisis/:id',
    component: ConsultaVerDetalles,
    canActivate: [authGuard, roleGuard(['Obstetra', 'Administrador'])],
  },
  // --- FIN DE LA CORRECCIÓN ---

  // --- RUTAS SOLO DE ADMINISTRADOR ---
  {
    path: 'obstetras',
    component: ListadoObstetras,
    canActivate: [authGuard, roleGuard(['Administrador'])],
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

  // --- RUTAS DE HISTORIAL MÉDICO (Común) ---
  {
    path: 'historialmedico/:id/programas',
    component: ProgramasHistorialmedico,
    canActivate: [authGuard],
  },

  {
    path: 'diagnostico/:id/controles',
    component: ListarControles,
    canActivate: [authGuard, roleGuard(['Obstetra', 'Administrador'])],
  },
  {
    path: 'diagnostico/:id/controles/crear',
    component: CrearEditarControlDiagnostico,
    canActivate: [authGuard, roleGuard(['Obstetra', 'Administrador'])],
  },
  {
    path: 'diagnostico/:id/controles/editar/:cid',
    component: CrearEditarControlDiagnostico,
    canActivate: [authGuard, roleGuard(['Obstetra', 'Administrador'])],
  },

  // --- RUTAS GENÉRICAS ---
  { path: 'no-autorizado', component: NoAutorizado },
  { path: '**', component: Notfound },

  
];
