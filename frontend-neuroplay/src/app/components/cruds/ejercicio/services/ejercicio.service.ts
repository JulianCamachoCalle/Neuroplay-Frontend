import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/enviroment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EjercicioService {
  private apiUrl = `${environment.urlApiEjercicios}`;

  constructor(private http: HttpClient) {}

  getEjercicios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEjercicio(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createEjercicio(ejercicio: any): Observable<any> {
    return this.http.post(this.apiUrl, ejercicio);
  }

  updateEjercicio(id: number, ejercicio: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ejercicio);
  }

  deleteEjercicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEjerciciosByTipo(tipo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  getEjerciciosByTerapia(idTerapia: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/terapia/${idTerapia}`);
  }
}
