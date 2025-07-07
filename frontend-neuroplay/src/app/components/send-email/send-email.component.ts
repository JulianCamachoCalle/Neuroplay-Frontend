import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmailService } from '../../services/email/email.service';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DashboardComponent],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent implements OnInit {
  emailForm!: FormGroup;
  message: string = '';
  usuarios: Usuario[] = [];
  loadingUsuarios: boolean = true;

  constructor(
    private formBuilder: FormBuilder, 
    private emailService: EmailService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      receptor: [''],
      proposito: [''],
      mensaje: [''],
      archivo: [null],
    });

    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loadingUsuarios = true;
    this.usuarioService.listAll().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.loadingUsuarios = false;
      },
      error: (error) => {
        console.error('Error al cargar los usuarios', error);
        this.loadingUsuarios = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.emailForm.patchValue({ archivo: file });
  }

  onSubmit() {
    const emailDto = this.emailForm.value;
    this.emailService.sendEmail(emailDto).subscribe(
      (response) => {
        // SweetAlert para mostrar el mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Email enviado correctamente!',
          text: 'Tu email se envio.',
          confirmButtonText: 'OK'
        });
        this.emailForm.reset();
      },
      (error) => {
        // SweetAlert para mostrar el mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar el email',
          text: 'Ocurrio un problema. Intentalo otra vez',
          confirmButtonText: 'OK'
        });
      }
    );

    console.log('Formulario enviado:', emailDto);
  }
}
