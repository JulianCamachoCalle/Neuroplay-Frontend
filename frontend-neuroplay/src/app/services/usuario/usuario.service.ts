import { Injectable } from '@angular/core';
import { environment } from '../../../environments/enviroment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Url de la Api usuario
  private urlApiUsuario = environment.urlApiUsuario;

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  listAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlApiUsuario);
  }

  // Obtener un usuario por id
  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlApiUsuario}/${id}`).pipe(
      catchError(this.handleError));
  }

  // Crear un nuevo usuario
  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.urlApiUsuario, usuario).pipe(
      catchError(this.handleError));
  }

  // Actualizar un usuario
  update(id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.urlApiUsuario}/${id}`, usuario).pipe(
      catchError(this.handleError));
  }

  registerUser(userData: Usuario): Observable<any> {
    return this.http.post(environment.urlHost + "auth/register", userData).pipe(
      catchError(this.handleError));
  }

  // Eliminar un usuario
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApiUsuario}/${id}`).pipe(
      catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error', error.error)
    } else {
      console.error('No retorno', error.status, error.error)
    }
    return throwError(() => new Error('Algo salio mal. Intenete nuevamente'))
  }

  checkUsernameExistence(username: string): Observable<any> {
    console.log(`Verificando existencia del email: ${username}`);

    // Verifica la URL antes de enviar la solicitud
    const url = `${environment.apiUrl}/usuario/check-username/${username}`;
    console.log("URL de la API:", url);

    return this.http.get<any>(url).pipe(
      tap((exists) => console.log("Resultado de la verificación (respuesta de la API):", exists)),
      catchError((error) => {
        console.error("Error en la verificación del email:", error);
        return of(false); // Retorna false si hay un error
      })
    );
  }

  checkTelefonoExistence(telefono: string): Observable<any> {
    console.log(`Verificando existencia del telfono: ${telefono}`);

    // Verifica la URL antes de enviar la solicitud
    const url = `${environment.apiUrl}/usuario/check-telefono/${telefono}`;
    console.log("URL de la API:", url);

    return this.http.get<any>(url).pipe(
      tap((exists) => console.log("Resultado de la verificación (respuesta de la API):", exists)),
      catchError((error) => {
        console.error("Error en la verificación del telefono:", error);
        return of(false); // Retorna false si hay un error
      })
    );
  }
}
