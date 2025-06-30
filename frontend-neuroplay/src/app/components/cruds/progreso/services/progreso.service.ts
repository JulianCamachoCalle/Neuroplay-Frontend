import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/enviroment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Progreso } from '../models/progreso';

@Injectable({
  providedIn: 'root',
})
export class ProgresoService {
  private apiUrl = `${environment.urlApiProgreso}`;

  constructor(private http: HttpClient) { }

  getProgresos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProgreso(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProgreso(progreso: any): Observable<any> {
    return this.http.post(this.apiUrl, progreso);
  }

  updateProgreso(id: number, progreso: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, progreso);
  }

  deleteProgreso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método específico para guardar progreso de terapia
  guardarProgresoTerapia(pacienteId: number, progreso: number, notas?: string): Observable<any> {
    const params = new HttpParams()
      .set('pacienteId', pacienteId.toString())
      .set('detalle', progreso.toString())
      .set('notas', notas || '');

    return this.http.post(`${this.apiUrl}/terapia`, null, { params });
  }

  // Método para actualizar el progreso total del paciente
  actualizarProgresoTotal(pacienteId: number, progresoTotal: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/paciente/${pacienteId}/progreso-total`, {
      progresoTotal
    });
  }

  // Registrar sesión completada
  registrarSesionCompletada(pacienteId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/sesion-completada`, null, {
      params: new HttpParams().set('pacienteId', pacienteId.toString())
    });
  }

  // Obtener progreso por terapia
  getProgresoByTerapia(pacienteId: number): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/terapia`, {
      params: new HttpParams().set('pacienteId', pacienteId.toString())
    });
  }

  getProgresosByPaciente(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  getEstadisticasByPaciente(pacienteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/paciente/${pacienteId}/estadisticas`);
  }
}
