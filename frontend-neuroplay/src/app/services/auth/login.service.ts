import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';
import { LoginRequest } from './loginRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/enviroment.development';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>('');
  currentUserId: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);
  currentUserRole: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.isBrowser()) {
      const token = sessionStorage.getItem('token');
      if (token) {
        this.initializeUser(token);
      }
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private initializeUser(token: string): void {
    this.currentUserLoginOn.next(true);
    const decodedToken = this.jwtHelper.decodeToken(token);
    console.log(decodedToken);
    this.currentUserData.next(token);
    this.currentUserId.next(decodedToken.userId);
    this.currentUserRole.next(decodedToken.rol);
  }

  login(credentials: LoginRequest) {
    return this.http
      .post<any>(`${environment.urlHost}auth/login`, credentials)
      .pipe(
        tap((userData) => {
          sessionStorage.setItem('token', userData.token);
          this.initializeUser(userData.token);
        }),
        map((userData) => userData.token),
        catchError(this.handleError)
      );
  }

  logOut(): void {
    sessionStorage.removeItem('token');
    this.currentUserLoginOn.next(false);
    this.currentUserId.next(null);
    this.currentUserRole.next(null);
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error:', error);
    return throwError(() => new Error('Algo salió mal: ' + error.message));
  }

  get userData() {
    return this.currentUserData.asObservable();
  }

  get userLoginOn() {
    return this.currentUserLoginOn.asObservable();
  }

  get userId() {
    return this.currentUserId.asObservable();
  }

  get userToken() {
    return this.currentUserData.value;
  }
}
