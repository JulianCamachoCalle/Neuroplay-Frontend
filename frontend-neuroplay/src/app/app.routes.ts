import { Routes } from '@angular/router';
import { UsuarioComponent } from './components/cruds/usuario/usuario.component';
import { UsuarioFormComponent } from './components/forms/usuario-form/usuario-form.component';
import { LoginRegisterComponent } from './auth/login-register/login-register.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { AuthGuard } from './components/guards/auth.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { PacienteComponent } from './components/pages/paciente/paciente.component';

export const routes: Routes = [
    { path: 'crud/usuario', component: UsuarioComponent },
    { path: 'new-usuario', component: UsuarioFormComponent },
    { path: ':id/edit', component: UsuarioFormComponent },
    { path: 'login', component: LoginRegisterComponent },
    { path: 'admin/email', component: SendEmailComponent },
    // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // pages
    { path: 'paciente', component:PacienteComponent }
];
