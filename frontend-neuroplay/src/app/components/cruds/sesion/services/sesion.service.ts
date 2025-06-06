import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/enviroment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  private apiUrl = `${environment.urlApiSesiones}`;

  constructor(private http: HttpClient) {}

  getSesiones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSesion(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createSesion(sesion: any): Observable<any> {
    return this.http.post(this.apiUrl, sesion);
  }

  updateSesion(id: number, sesion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, sesion);
  }

  deleteSesion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSesionesByPaciente(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  marcarCompletada(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/completada`, {});
  }
}
