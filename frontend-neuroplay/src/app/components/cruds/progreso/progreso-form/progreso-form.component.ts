import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Paciente } from '../../pacientes/models/paciente';
import { ProgresoService } from '../services/progreso.service';
import { PacienteService } from '../../pacientes/services/paciente.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prgreso-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './progreso-form.component.html',
  styleUrl: './progreso-form.component.css',
})
export class ProgresoFormComponent implements OnInit {
  progresoForm: FormGroup;
  isEdit = false;
  pacientes: Paciente[] = [];

  constructor(
    private fb: FormBuilder,
    private progresoService: ProgresoService,
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.progresoForm = this.fb.group({
      pacienteId: ['', Validators.required],
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      fuerza: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      movilidad: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      detalle: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      notas: [''],
    });
  }

  ngOnInit(): void {
    this.loadPacientes();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.loadProgreso(id);
    }
  }

  loadPacientes(): void {
    this.pacienteService.getPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
      },
      error: (err) => console.error('Error al cargar pacientes:', err),
    });
  }

  loadProgreso(id: number): void {
    this.progresoService.getProgreso(id).subscribe({
      next: (progreso) => {
        this.progresoForm.patchValue({
          ...progreso,
          fecha: progreso.fecha
            ? new Date(progreso.fecha).toISOString().substring(0, 10)
            : new Date().toISOString().substring(0, 10),
        });
      },
      error: (err) => console.error(err),
    });
  }

  onSubmit(): void {
    if (this.progresoForm.valid) {
      const progresoData = this.progresoForm.value;

      if (this.isEdit) {
        const id = this.route.snapshot.params['id'];
        this.progresoService.updateProgreso(id, progresoData).subscribe({
          next: () => this.router.navigate(['/progresos']),
          error: (err) => console.error(err),
        });
      } else {
        this.progresoService.createProgreso(progresoData).subscribe({
          next: () => this.router.navigate(['/progresos']),
          error: (err) => console.error(err),
        });
      }
    }
  }
}
