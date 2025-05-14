import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TerapiaService } from '../services/terapia.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PacienteService } from '../../pacientes/services/paciente.service';
import { TerapeutaService } from '../../terapeutas/services/terapeuta.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terapia-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './terapia-form.component.html',
  styleUrl: './terapia-form.component.css',
})
export class TerapiaFormComponent implements OnInit {
  terapiaForm: FormGroup;
  isEdit = false;
  pacientes: any[] = [];
  terapeutas: any[] = [];
  estados = ['ACTIVA', 'PAUSADA', 'COMPLETADA'];

  constructor(
    private fb: FormBuilder,
    private terapiaService: TerapiaService,
    private pacienteService: PacienteService,
    private terapeutaService: TerapeutaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.terapiaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      pacienteId: ['', Validators.required],
      terapeutaId: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      estado: ['ACTIVA'],
    });
  }

  ngOnInit(): void {
    this.loadPacientes();
    this.loadTerapeutas();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.loadTerapia(id);
    }
  }

  loadPacientes(): void {
    this.pacienteService.getPacientes().subscribe((pacientes) => {
      this.pacientes = pacientes;
    });
  }

  loadTerapeutas(): void {
    this.terapeutaService.getTerapeutas().subscribe((terapeutas) => {
      this.terapeutas = terapeutas;
    });
  }

  loadTerapia(id: number): void {
    this.terapiaService.getTerapia(id).subscribe((terapia) => {
      this.terapiaForm.patchValue({
        ...terapia,
        fechaInicio: new Date(terapia.fechaInicio)
          .toISOString()
          .substring(0, 10),
      });
      if (terapia.fechaFin) {
        this.terapiaForm.patchValue({
          fechaFin: new Date(terapia.fechaFin).toISOString().substring(0, 10),
        });
      }
    });
  }

  onSubmit(): void {
    if (this.terapiaForm.valid) {
      const terapiaData = this.terapiaForm.value;

      if (this.isEdit) {
        const id = this.route.snapshot.params['id'];
        this.terapiaService.updateTerapia(id, terapiaData).subscribe({
          next: () => this.router.navigate(['/terapias']),
          error: (err) => console.error(err),
        });
      } else {
        this.terapiaService.createTerapia(terapiaData).subscribe({
          next: () => this.router.navigate(['/terapias']),
          error: (err) => console.error(err),
        });
      }
    }
  }
}
