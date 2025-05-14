import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/auth/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('token');

    // Verifica si hay un token y si no ha expirado
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);

      // Asegúrate de que el rol esté presente en el token
      console.log('Decoded Token:', decodedToken);

      // Verifica si el usuario tiene el rol necesario
      if (this.hasRequiredRole(decodedToken.rol)) {
        return true; // Permite el acceso
      }
    }

    // Muestra un mensaje de acceso denegado usando SweetAlert2
    Swal.fire({
      title: 'Acceso Denegado',
      text: 'No tienes permiso para acceder a esta página.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });

    // Redirige al inicio
    this.router.navigate(['/']);
    return false;
  }

  private hasRequiredRole(rol: string): boolean {
    // Permitir acceso solo si el rol es ADMIN
    return rol === 'ADMIN';
  }
}
