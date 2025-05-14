import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtHelperWapperService {

  private jwtHelper: JwtHelperService;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.jwtHelper = this.isBrowser ? new JwtHelperService() : {} as JwtHelperService;
  }

  decodeToken(token: string): any {
    return this.isBrowser ? this.jwtHelper.decodeToken(token) : null;
  }

  isTokenExpired(token: string): boolean {
    return this.isBrowser ? this.jwtHelper.isTokenExpired(token) : true;
  }
}
