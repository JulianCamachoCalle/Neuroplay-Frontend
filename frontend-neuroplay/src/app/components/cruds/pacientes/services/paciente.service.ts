import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/enviroment.development';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private apiUrl = `${environment.urlApiPacientes}`;

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPaciente(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPaciente(paciente: any): Observable<any> {
    return this.http.post(this.apiUrl, paciente);
  }

  updatePaciente(id: number, paciente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paciente);
  }

  deletePaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPacienteByUsuario(usuarioId: number | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getPacientesByTerapeuta(terapeutaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/terapeuta/${terapeutaId}`);
  }
}
