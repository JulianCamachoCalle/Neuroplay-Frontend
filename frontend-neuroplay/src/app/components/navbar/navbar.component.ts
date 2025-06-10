import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  nombre: string = '';
  userRole: string | null = null;
  userId: number | null = null;
  userLowerCase: string = '';
  menuAbierto = false;

  @ViewChild('menuContent') menuContent!: ElementRef;
  @ViewChild('menuButton') menuButton!: ElementRef;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent) {
    const clicFueraMenu =
      this.menuContent &&
      !this.menuContent.nativeElement.contains(event.target) &&
      !this.menuButton.nativeElement.contains(event.target);

    if (clicFueraMenu) {
      this.menuAbierto = false;
    }
  }

  private subscriptions: Subscription = new Subscription();
  private isBrowser: boolean;

  constructor(
    private loginService: LoginService,
    private jwtHelper: JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Suscripción al estado de login
    this.subscriptions.add(
      this.loginService.userLoginOn.subscribe((loginOn) => {
        this.isLoggedIn = loginOn;
        if (loginOn && this.isBrowser) {
          this.loadUserData();
        }
      })
    );

    // Verificar token al cargar
    if (this.isBrowser) {
      this.checkCurrentToken();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private checkCurrentToken(): void {
    const token = this.loginService.userToken;
    if (
      token &&
      typeof token === 'string' &&
      !this.jwtHelper.isTokenExpired(token)
    ) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.updateUserData(decodedToken);
    }
  }

  private loadUserData(): void {
    const token = this.loginService.userToken;
    if (
      token &&
      typeof token === 'string' &&
      !this.jwtHelper.isTokenExpired(token)
    ) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.updateUserData(decodedToken);
    }
  }

  private updateUserData(decodedToken: any): void {
    this.nombre = decodedToken.nombre || null;
    this.userId = decodedToken.id || null;
    this.userRole = decodedToken.rol || null;
    this.userLowerCase = this.userRole ? this.userRole.toLowerCase() : '';
  }

  logout(): void {
    if (this.isBrowser) {
      this.loginService.logOut();
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : `${parts[0][0]}`.toUpperCase();
  }
}
