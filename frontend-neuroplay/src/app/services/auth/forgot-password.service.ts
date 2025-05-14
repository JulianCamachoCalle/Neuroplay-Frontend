import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/enviroment.development';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpClient) { }

  verificarEmail(email: string) {
    return this.http.post(`${environment.urlApiForgotPassword}/verificarEmail/${email}`, {}, { responseType: 'text' });
  }

  verificarOTP(otp: number, email: string) {
    return this.http.post<string>(
      `${environment.urlApiForgotPassword}/verificarOTP/${otp}/${email}`,
      {}
    );
  }

  cambiarContrasena(email: string, passwords: { password: string; repeatPassword: string }) {
    return this.http.post<string>(`${environment.urlApiForgotPassword}/changePassword/${email}`, passwords);
  }
}
