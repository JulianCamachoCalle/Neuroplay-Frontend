import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EjercicioService } from '../services/ejercicio.service';
import { Terapia } from '../../terapia/models/terapia';
import { TerapiaService } from '../../terapia/services/terapia.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-ejercicio-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './ejercicio-form.component.html',
  styleUrl: './ejercicio-form.component.css',
})
export class EjercicioFormComponent implements OnInit {
  ejercicioForm: FormGroup;
  isEdit = false;
  terapias: Terapia[] = []; // Lista de terapias

  constructor(
    private fb: FormBuilder,
    private ejercicioService: EjercicioService,
    private terapiaService: TerapiaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ejercicioForm = this.fb.group({
      terapiaId: ['', Validators.required],
      terapiaNombre: [{ value: '', disabled: true }, Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      repeticiones: [0, [Validators.required, Validators.min(1)]],
      duracionMinutos: [0, [Validators.required, Validators.min(1)]],
      nivelDificultad: ['', Validators.required],
      videoUrl: [''], // <-- Siempre habilitados
      imagenUrl: [''], // <-- Siempre habilitados
    });
  }

  ngOnInit(): void {
    this.loadTerapias();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.loadEjercicio(id);
    }

    // Configurar el observable para el autocompletado
    this.ejercicioForm
      .get('terapiaId')
      ?.valueChanges.pipe(
        debounceTime(300), // Espera 300ms después de cada tecleo
        distinctUntilChanged(), // Solo continúa si el valor cambió
        switchMap((terapiaId) => this.terapiaService.getTerapia(terapiaId))
      )
      .subscribe({
        next: (terapia) => {
          if (terapia) {
            this.ejercicioForm.patchValue({
              terapiaNombre: terapia.nombre,
            });
          } else {
            this.ejercicioForm.patchValue({
              terapiaNombre: 'Terapia no encontrada',
            });
          }
        },
        error: (err) => {
          console.error('Error al buscar terapia:', err);
          this.ejercicioForm.patchValue({
            terapiaNombre: 'Error al cargar terapia',
          });
        },
      });
  }

  loadTerapias(): void {
    this.terapiaService.getTerapias().subscribe({
      next: (terapias) => {
        this.terapias = terapias;
        // Si hay solo una terapia, seleccionarla por defecto
        if (terapias.length === 1 && !this.isEdit) {
          this.ejercicioForm.patchValue({
            terapiaId: terapias[0].id,
            terapiaNombre: terapias[0].nombre,
          });
        }
      },
      error: (err) => console.error('Error al cargar terapias:', err),
    });
  }

  loadEjercicio(id: number): void {
    this.ejercicioService.getEjercicio(id).subscribe({
      next: (ejercicio) => {
        this.ejercicioForm.patchValue({
          ...ejercicio,
          terapiaId: ejercicio.terapiaId || '',
          videoUrl: ejercicio.videoUrl || '',
          imagenUrl: ejercicio.imagenUrl || '',
        });

        // Solo deshabilita terapiaId
        if (this.isEdit) {
          this.ejercicioForm.get('terapiaId')?.disable();
        }
      },
      error: (err) => console.error(err),
    });
  }

  onSubmit(): void {
    console.log(this.ejercicioForm.getRawValue());
    if (this.ejercicioForm.valid) {
      const ejercicioData = this.ejercicioForm.getRawValue();

      if (this.isEdit) {
        const id = this.route.snapshot.params['id'];
        this.ejercicioService.updateEjercicio(id, ejercicioData).subscribe({
          next: () => this.router.navigate(['/ejercicios']),
          error: (err) => console.error(err),
        });
      } else {
        this.ejercicioService.createEjercicio(ejercicioData).subscribe({
          next: () => this.router.navigate(['/ejercicios']),
          error: (err) => console.error(err),
        });
      }

      // Volver a deshabilitar el campo después de enviar
      this.ejercicioForm.get('terapiaNombre')?.disable();
    }
  }
}
