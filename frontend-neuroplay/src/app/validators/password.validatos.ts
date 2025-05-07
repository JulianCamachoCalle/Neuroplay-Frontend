import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const password = control.get('firstPassword')?.value;
        const confirmPassword = control.get('secondPassword')?.value;

        return password === confirmPassword ? null : { mismatch: true };
    };
}