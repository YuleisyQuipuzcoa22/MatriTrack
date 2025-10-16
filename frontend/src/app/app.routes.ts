import { Routes } from '@angular/router';
import { Login } from './features/UsuarioObstetra/pages/login/login';
import { RegisterEditarUser } from './features/UsuarioObstetra/pages/crear&editar-obstetra/registerEditar-user';
import { Sidebar } from './components/sidebar/sidebar';
import { Notfound } from './components/notfound/notfound';
import { ListadoPacientes } from './features/Paciente/pages/listado-pacientes/listado-pacientes';
import { ListadoObstetras } from './features/UsuarioObstetra/pages/listado-obstetras/listado-obstetras';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: Login },

  { path: 'listaPacientes', component: ListadoPacientes },
  //obstetras
  { path: 'obstetras', component: ListadoObstetras },
  { path: 'obstetras/registrar', component: RegisterEditarUser },
  { path: 'obstetras/editar/:id', component: RegisterEditarUser },

  { path: '**', component: Notfound },
];
