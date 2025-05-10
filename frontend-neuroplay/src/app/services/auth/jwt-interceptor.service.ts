import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService {

  constructor(private loginService: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let token: String = this.loginService.userToken;

    if (token != "") {
      req = req.clone({
        setHeaders: {
          'Conten-Type': 'application/json;charset=utf-8',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
      )
    }

    return next.handle(req);
  }
}
