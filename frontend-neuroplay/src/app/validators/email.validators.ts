import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario/usuario.service';

export function emailValidator(usuarioService: UsuarioService) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = control.value;
    if (!email) return of(null);

    console.log("Iniciando validación para:", email); // Asegura que se muestra este log

    return usuarioService.checkUsernameExistence(email).pipe(
      debounceTime(300),
      switchMap((exists) => {
        console.log("Respuesta de existencia del email:", exists); // Revisa si este log aparece
        return exists ? of({ emailExists: true }) : of(null);
      }),
      catchError((error) => {
        console.error("Error durante la validación del email:", error);
        return of(null);
      })
    );
  };
}