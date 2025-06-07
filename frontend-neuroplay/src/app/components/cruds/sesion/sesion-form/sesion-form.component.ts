import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Ejercicio } from '../../ejercicio/models/ejercicio';
import { Paciente } from '../../pacientes/models/paciente';
import { SesionService } from '../services/sesion.service';
import { EjercicioService } from '../../ejercicio/services/ejercicio.service';
import { PacienteService } from '../../pacientes/services/paciente.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sesion-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sesion-form.component.html',
  styleUrl: './sesion-form.component.css',
})
export class SesionFormComponent implements OnInit {
  sesionForm: FormGroup;
  isEdit = false;
  ejercicios: Ejercicio[] = [];
  pacientes: Paciente[] = [];

  constructor(
    private fb: FormBuilder,
    private sesionService: SesionService,
    private ejercicioService: EjercicioService,
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sesionForm = this.fb.group({
      ejercicioId: ['', Validators.required],
      nombreEjercicio: [{ value: '', disabled: true }],
      pacienteId: ['', Validators.required],
      nombrePaciente: [{ value: '', disabled: true }],
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      duracionMinutos: [0, [Validators.required, Validators.min(1)]],
      rendimiento: ['', Validators.required],
      completada: [false],
      activacionMuscular: [0, [Validators.required, Validators.min(0)]],
      picoActivacion: [0, [Validators.required, Validators.min(0)]],
      repeticiones: [0, [Validators.required, Validators.min(0)]],
      observaciones: [''],
    });
  }

  ngOnInit(): void {
    this.loadEjercicios();
    this.loadPacientes();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.loadSesion(id);
    }

    // Autocompletado para ejercicio
    this.sesionForm
      .get('ejercicioId')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((ejercicioId) =>
          this.ejercicioService.getEjercicio(ejercicioId)
        )
      )
      .subscribe({
        next: (ejercicio) => {
          this.sesionForm.patchValue({
            nombreEjercicio: ejercicio?.nombre || 'Ejercicio no encontrado',
          });
        },
        error: (err) => {
          console.error('Error al buscar ejercicio:', err);
          this.sesionForm.patchValue({
            nombreEjercicio: 'Error al cargar ejercicio',
          });
        },
      });

    // Autocompletado para paciente
    this.sesionForm
      .get('pacienteId')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((pacienteId) => this.pacienteService.getPaciente(pacienteId))
      )
      .subscribe({
        next: (paciente) => {
          this.sesionForm.patchValue({
            nombrePaciente: paciente
              ? `${paciente.usuario?.nombre} ${paciente.usuario?.apellido}`
              : 'Paciente no encontrado',
          });
        },
        error: (err) => {
          console.error('Error al buscar paciente:', err);
          this.sesionForm.patchValue({
            nombrePaciente: 'Error al cargar paciente',
          });
        },
      });
  }

  loadEjercicios(): void {
    this.ejercicioService.getEjercicios().subscribe({
      next: (ejercicios) => {
        this.ejercicios = ejercicios;
      },
      error: (err) => console.error('Error al cargar ejercicios:', err),
    });
  }

  loadPacientes(): void {
    this.pacienteService.getPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
      },
      error: (err) => console.error('Error al cargar pacientes:', err),
    });
  }

  loadSesion(id: number): void {
    this.sesionService.getSesion(id).subscribe({
      next: (sesion) => {
        this.sesionForm.patchValue({
          ...sesion,
          fecha: sesion.fecha
            ? new Date(sesion.fecha).toISOString().substring(0, 10)
            : new Date().toISOString().substring(0, 10),
        });
      },
      error: (err) => console.error(err),
    });
  }

  onSubmit(): void {
    if (this.sesionForm.valid) {
      const sesionData = this.sesionForm.value;

      if (this.isEdit) {
        const id = this.route.snapshot.params['id'];
        this.sesionService.updateSesion(id, sesionData).subscribe({
          next: () => this.router.navigate(['/sesiones']),
          error: (err) => console.error(err),
        });
      } else {
        this.sesionService.createSesion(sesionData).subscribe({
          next: () => this.router.navigate(['/sesiones']),
          error: (err) => console.error(err),
        });
      }
    }
  }
}
