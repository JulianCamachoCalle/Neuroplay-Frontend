import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/enviroment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgresoService {
  private apiUrl = `${environment.urlApiProgreso}`;

  constructor(private http: HttpClient) {}

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

  getProgresosByPaciente(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  getEstadisticasByPaciente(pacienteId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/paciente/${pacienteId}/estadisticas`
    );
  }
}
