import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/enviroment.development';
import { Paciente } from '../models/paciente';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private apiUrl = `${environment.urlApiPacientes}`;

  constructor(private http: HttpClient) { }

  actualizarProgresoPaciente(
    id: number,
    progresoTotal: number,
    ejerciciosCompletados?: number,
    diasConsecutivos?: number
  ): Observable<Paciente> {
    const params = new HttpParams()
      .set('progresoTotal', progresoTotal.toString())
      .set('ejerciciosCompletados', ejerciciosCompletados?.toString() || '')
      .set('diasConsecutivos', diasConsecutivos?.toString() || '');

    return this.http.patch<Paciente>(`${this.apiUrl}/${id}/progreso`, null, { params });
  }
  
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  getPaciente(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  createPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  updatePaciente(id: number, paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }

  deletePaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPacienteByUsuario(usuarioId: number | null): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getPacientesByTerapeuta(terapeutaId: number): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/terapeuta/${terapeutaId}`);
  }
}
