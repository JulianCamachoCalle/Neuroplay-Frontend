import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/enviroment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TerapeutaService {
  private apiUrl = `${environment.urlApiTerapeutas}`;

  constructor(private http: HttpClient) {}

  getTerapeutas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTerapeuta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createTerapeuta(terapeuta: any): Observable<any> {
    return this.http.post(this.apiUrl, terapeuta);
  }

  updateTerapeuta(id: number, terapeuta: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, terapeuta);
  }

  deleteTerapeuta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getPacientesByTerapeuta(terapeutaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${terapeutaId}/pacientes`);
  }
}
