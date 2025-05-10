import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/enviroment.development';

interface EmailDto {
  receptor: string;
  proposito: string;
  mensaje: string;
  archivo?: File;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  sendEmail(emailDto: EmailDto) {
    const formData = new FormData();
    formData.append('receptor', emailDto.receptor);
    formData.append('proposito', emailDto.proposito);
    formData.append('mensaje', emailDto.mensaje);
    if (emailDto.archivo) {
      formData.append('archivo', emailDto.archivo);
    }

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(environment.urlApiEmail, formData, { headers });
  }
}
