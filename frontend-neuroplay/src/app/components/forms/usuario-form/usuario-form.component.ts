import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { emailValidator } from '../../../validators/email.validators';
import { telefonoValidators } from '../../../validators/telefono.validators';
import { Usuario } from '../../../models/usuario.model';
import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../dashboard/dashboard.component';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css',
})
export class UsuarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);

  form?: FormGroup;
  usuario?: Usuario;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.usuarioService.getById(parseInt(id)).subscribe((usuario) => {
        this.usuario = usuario;
        this.form = this.fb.group({
          nombre: [
            usuario.nombre,
            [
              Validators.required,
              Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/),
            ],
          ],
          apellido: [
            usuario.apellido,
            [
              Validators.required,
              Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/),
            ],
          ],
          username: [usuario.username, [Validators.required, Validators.email]],
          password: [
            usuario.password,
            [
              Validators.required,
              Validators.minLength(8),
              Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$&*.]).{8,}$/),
            ],
          ],
          fechaNacimiento: [usuario.fechaNacimiento, [Validators.required]],
          genero: [usuario.genero],
          telefono: [
            usuario.telefono,
            [Validators.required, Validators.pattern(/^9\d{8}$/)],
          ],
          avatar: [usuario.avatar],
          estado: [usuario.estado],
          rol: [usuario.rol, [Validators.required]],
        });
      });
    } else {
      this.form = this.fb.group({
        rol: ['', [Validators.required]],
        nombre: [
          '',
          [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)],
        ],
        apellido: [
          '',
          [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)],
        ],
        username: [
          '',
          [Validators.required, Validators.email],
          [emailValidator(this.usuarioService)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$&*.]).{8,}$/),
          ],
        ],
        fechaNacimiento: [''],
        genero: [''],
        telefono: [
          '',
          [Validators.required, Validators.pattern(/^9\d{8}$/)],
          [telefonoValidators(this.usuarioService)],
        ],
        avatar: ['default.png'],
        estado: ['ACTIVO'],
      });
    }
  }

  save() {
    if (this.form?.invalid) {
      return;
    }

    const usuarioForm = this.form!.value;

    const usuarioAction = this.usuario
      ? this.usuarioService.update(this.usuario.id, usuarioForm)
      : this.usuarioService.create(usuarioForm);

    usuarioAction
      .pipe(
        catchError(() => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al procesar la solicitud. Inténtalo nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          return [];
        })
      )
      .subscribe(() => {
        Swal.fire({
          title: this.usuario
            ? '¡Actualización exitosa!'
            : '¡Creación exitosa!',
          text: `El usuario "${usuarioForm.nombre}" ha sido ${
            this.usuario ? 'actualizado' : 'creado'
          }.`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.router.navigate(['/crud/usuario']);
        });
      });
  }
}
