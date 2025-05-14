import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/auth/login.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = sessionStorage.getItem('token');

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Decoded Token:', decodedToken);
      console.log('Route Params:', route.params);
      if (
        decodedToken.rol === 'PACIENTE' &&
        decodedToken.id.toString() === route.params['id']
      ) {
        return true;
      }
    }

    Swal.fire({
      title: 'Acceso Denegado',
      text: 'No tienes permiso para ver este perfil.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });

    this.router.navigate(['/']);
    return false;
  }
}
