import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/enviroment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Terapia } from '../models/terapia';

@Injectable({
  providedIn: 'root',
})
export class TerapiaService {
  private apiUrl = `${environment.urlApiTerapias}`;

  constructor(private http: HttpClient) {}

  getTerapias(): Observable<Terapia[]> {
    return this.http.get<Terapia[]>(this.apiUrl);
  }

  getTerapia(id: number): Observable<Terapia> {
    return this.http.get<Terapia>(`${this.apiUrl}/${id}`);
  }

  createTerapia(terapia: Terapia): Observable<any> {
    return this.http.post(this.apiUrl, terapia);
  }

  updateTerapia(id: number, terapia: Terapia): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, terapia);
  }

  deleteTerapia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByPaciente(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  getByTerapeuta(terapeutaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/terapeuta/${terapeutaId}`);
  }

  cambiarEstado(id: number, estado: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
