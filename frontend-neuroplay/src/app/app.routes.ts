import { Routes } from '@angular/router';
import { UsuarioComponent } from './components/cruds/usuario/usuario.component';
import { UsuarioFormComponent } from './components/forms/usuario-form/usuario-form.component';

export const routes: Routes = [
    { path: 'crud/usuario', component: UsuarioComponent },
    { path: 'new-usuario', component: UsuarioFormComponent },
    { path: ':id/edit', component: UsuarioFormComponent },
];
