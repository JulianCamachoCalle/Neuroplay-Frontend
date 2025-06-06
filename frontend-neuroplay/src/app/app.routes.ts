import { Routes } from '@angular/router';
import { UsuarioComponent } from './components/cruds/usuario/usuario.component';
import { UsuarioFormComponent } from './components/forms/usuario-form/usuario-form.component';
import { LoginRegisterComponent } from './auth/login-register/login-register.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { AuthGuard } from './components/guards/auth.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { PacienteComponent } from './components/pages/paciente/paciente.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileGuard } from './components/guards/profile-guard.guard';
import { PacienteListComponent } from './components/cruds/pacientes/paciente-list/paciente-list.component';
import { PacienteFormComponent } from './components/cruds/pacientes/paciente-form/paciente-form.component';
import { PacienteDetailComponent } from './components/cruds/pacientes/paciente-detail/paciente-detail.component';
import { TerapiaListComponent } from './components/cruds/terapia/terapia-list/terapia-list.component';
import { TerapiaFormComponent } from './components/cruds/terapia/terapia-form/terapia-form.component';
import { TerapiaDetailComponent } from './components/cruds/terapia/terapia-detail/terapia-detail.component';
import { TerapeutaListComponent } from './components/cruds/terapeutas/terapeuta-list/terapeuta-list.component';
import { TerapeutaFormComponent } from './components/cruds/terapeutas/terapeuta-form/terapeuta-form.component';
import { TerapeutaDetailComponent } from './components/cruds/terapeutas/terapeuta-detail/terapeuta-detail.component';
import { EjercicioListComponent } from './components/cruds/ejercicio/ejercicio-list/ejercicio-list.component';
import { EjercicioFormComponent } from './components/cruds/ejercicio/ejercicio-form/ejercicio-form.component';
import { EjercicioDetailComponent } from './components/cruds/ejercicio/ejercicio-detail/ejercicio-detail.component';
import { ProgresoListComponent } from './components/cruds/progreso/progreso-list/progreso-list.component';
import { ProgresoDetailComponent } from './components/cruds/progreso/progreso-detail/progreso-detail.component';
import { ProgresoFormComponent } from './components/cruds/progreso/progreso-form/progreso-form.component';
import { SesionListComponent } from './components/cruds/sesion/sesion-list/sesion-list.component';
import { SesionFormComponent } from './components/cruds/sesion/sesion-form/sesion-form.component';
import { SesionDetailComponent } from './components/cruds/sesion/sesion-detail/sesion-detail.component';

export const routes: Routes = [
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'new-usuario', component: UsuarioFormComponent },
  { path: ':id/edit', component: UsuarioFormComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: '', component: LoginRegisterComponent },
  { path: 'admin/email', component: SendEmailComponent },
  // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  // pages
  { path: 'paciente', component: PacienteComponent },
  {
    path: 'perfil/:id',
    component: UserProfileComponent,
    canActivate: [ProfileGuard],
  },
  { path: 'pacientes', component: PacienteListComponent },
  { path: 'pacientes/nueva', component: PacienteFormComponent },
  { path: 'pacientes/:id', component: PacienteDetailComponent },
  { path: 'pacientes/:id/editar', component: PacienteFormComponent },
  { path: 'terapias', component: TerapiaListComponent },
  { path: 'terapias/nueva', component: TerapiaFormComponent },
  { path: 'terapias/:id', component: TerapiaDetailComponent },
  { path: 'terapias/:id/editar', component: TerapiaFormComponent },
  { path: 'terapeutas', component: TerapeutaListComponent },
  { path: 'terapeutas/nueva', component: TerapeutaFormComponent },
  { path: 'terapeutas/:id', component: TerapeutaDetailComponent },
  { path: 'terapeutas/:id/editar', component: TerapeutaFormComponent },
  { path: 'ejercicios', component: EjercicioListComponent },
  { path: 'ejercicios/nueva', component: EjercicioFormComponent },
  { path: 'ejercicios/:id', component: EjercicioDetailComponent },
  { path: 'ejercicios/:id/editar', component: EjercicioFormComponent },
  { path: 'progresos', component: ProgresoListComponent },
  { path: 'progresos/nueva', component: ProgresoFormComponent },
  { path: 'progresos/:id', component: ProgresoDetailComponent },
  { path: 'progresos/:id/editar', component: ProgresoFormComponent },
  { path: 'sesion', component: SesionListComponent },
  { path: 'sesion/nueva', component: SesionFormComponent },
  { path: 'sesion/:id', component: SesionDetailComponent },
  { path: 'sesion/:id/editar', component: SesionFormComponent },
];
