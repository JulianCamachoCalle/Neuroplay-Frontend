import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPasswordService } from '../../services/auth/forgot-password.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { emailValidator } from '../../validators/email.validators';
import { passwordMatchValidator } from '../../validators/password.validatos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  step = 1;
  email: string = '';
  otp: string = '';
  password: string = '';
  repeatPassword: string = '';
  forgotPassword!: FormGroup;
  changePassword!: FormGroup;

  constructor(private authService: ForgotPasswordService, private formBuilder: FormBuilder, private router: Router, private userService: UsuarioService) { }

  ngOnInit(): void {
    this.forgotPassword = this.formBuilder.group({
      emailvalidar: ['', [Validators.required, Validators.email], [emailValidator(this.userService)]]
    });

    this.changePassword = this.formBuilder.group({
      firstPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$&*.]).{8,}$/)]],
      secondPassword: ['', [Validators.required]],
    }, { validators: passwordMatchValidator() });
  }

  enviarEmail() {
    Swal.fire({
      title: 'Enviando correo...',
      html: '<img src="assets/gif/mensaje.gif" alt="Cargando..." style="width: 100px; height: 100px;">',
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    this.authService.verificarEmail(this.email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Correo enviado!',
          text: 'Por favor, revisa tu bandeja de entrada para obtener tu TOKEN.',
        });
        this.step = 2;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.error || 'Error al enviar el email.',
        });
      },
    });
  }


  verificarOTP() {
    // Verificar si otp es nulo o indefinido
    if (this.otp == null || this.otp === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa un TOKEN válido.',
      });
      return;
    }

    // Convertir otp de string a number
    const otpNumber = Number(this.otp);

    // Verificar que la conversión fue exitosa
    if (isNaN(otpNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El TOKEN debe ser un número válido.',
      });
      return;
    }

    Swal.fire({
      title: 'Verificando TOKEN...',
      text: 'Por favor espera unos segundos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    // Llamar al servicio con el número convertido
    this.authService.verificarOTP(otpNumber, this.email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡TOKEN Verificado!',
          text: 'Puedes continuar con el cambio de contraseña.',
        });
        this.step = 3;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.error || 'TOKEN incorrecto o expirado.',
        });
      },
    });
  }

  cambiarContrasena() {
    this.authService
      .cambiarContrasena(this.email, { password: this.password, repeatPassword: this.repeatPassword })
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Contraseña cambiada!',
            text: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
            timer: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error.error || 'Error al cambiar la contraseña.',
          });
        },
      });
  }

  get emailvalidar() {
    return this.forgotPassword.get('emailvalidar');
  }

  get firstPassword() {
    return this.changePassword.get('firstPassword')
  }

  get secondPassword() {
    return this.changePassword.get('secondPassword')
  }
}
