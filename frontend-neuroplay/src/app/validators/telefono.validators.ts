import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, switchMap, tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario/usuario.service';

export function telefonoValidators(usuarioService: UsuarioService) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const telefono = control.value;
    if (!telefono) return of(null);

    console.log("Iniciando validación para el teléfono:", telefono);

    return usuarioService.checkTelefonoExistence(telefono).pipe(
      debounceTime(300),
      switchMap((exists) => {
        console.log("Respuesta de existencia del teléfono:", exists);
        return exists ? of({ phoneExists: true }) : of(null);
      }),
      catchError((error) => {
        console.error("Error durante la validación del teléfono:", error);
        return of(null);
      })
    );
  };
}