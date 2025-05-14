import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PacienteService } from '../services/paciente.service';
import { UsuarioService } from '../../../../services/usuario/usuario.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TerapeutaService } from '../../terapeutas/services/terapeuta.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.css',
})
export class PacienteFormComponent implements OnInit {
  pacienteForm: FormGroup;
  isEdit = false;
  usuarios: any[] = [];
  terapeutas: any[] = [];
  tiposAcv = ['Isquémico', 'Hemorrágico', 'TIA'];

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService,
    private terapeutaService: TerapeutaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pacienteForm = this.fb.group({
      usuarioId: ['', Validators.required],
      terapeutaId: ['', Validators.required],
      fechaAcv: ['', Validators.required],
      tipoAcv: ['', Validators.required],
      antecedentes: [''],
      medicacionActual: [''],
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadTerapeutas();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.loadPaciente(id);
    }
  }

  loadUsuarios(): void {
    this.usuarioService.listAll().subscribe((usuarios) => {
      this.usuarios = usuarios.filter((u) => u.rol === 'PACIENTE' && u.id);
    });
  }

  loadTerapeutas(): void {
    this.usuarioService.listAll().subscribe((terapeutas) => {
      this.terapeutas = terapeutas.filter((u) => u.rol === 'TERAPEUTA' && u.id);
    });
  }

  loadPaciente(id: number): void {
    this.pacienteService.getPaciente(id).subscribe((paciente) => {
      this.pacienteForm.patchValue({
        ...paciente,
        fechaAcv: new Date(paciente.fechaAcv).toISOString().substring(0, 10),
      });
    });
  }

  onSubmit(): void {
    if (this.pacienteForm.valid) {
      const pacienteData = this.pacienteForm.value;

      if (this.isEdit) {
        const id = this.route.snapshot.params['id'];
        this.pacienteService.updatePaciente(id, pacienteData).subscribe({
          next: () => this.router.navigate(['/pacientes']),
          error: (err) => console.error(err),
        });
      } else {
        this.pacienteService.createPaciente(pacienteData).subscribe({
          next: () => this.router.navigate(['/pacientes']),
          error: (err) => console.error(err),
        });
      }
    }
  }
}
