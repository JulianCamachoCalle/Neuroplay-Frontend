import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TerapeutaService } from '../services/terapeuta.service';
import { UsuarioService } from '../../../../services/usuario/usuario.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terapeuta-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './terapeuta-form.component.html',
  styleUrl: './terapeuta-form.component.css',
})
export class TerapeutaFormComponent {
  terapeutaForm: FormGroup;
  isEdit = false;
  usuarios: any[] = [];
  terapeutas: any[] = [];
  especialidades = [
    'Neurología',
    'Fisioterapia Neurológica',
    'Terapia del Lenguaje',
    'Terapia Ocupacional',
    'Neuropsicología',
    'Psicología Clínica',
    'Trabajo Social',
    'Nutrición y Dietética',
  ];

  constructor(
    private fb: FormBuilder,
    private terapeutaService: TerapeutaService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.terapeutaForm = this.fb.group({
      especialidad: ['', Validators.required],
      licencia: ['', Validators.required],
      biografia: ['', Validators.required],
      usuarioId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.loadTerapeuta(id);
    }
  }

  loadUsuarios(): void {
    this.usuarioService.listAll().subscribe((usuarios) => {
      if (usuarios && Array.isArray(usuarios)) {
        this.usuarios = usuarios.filter((u) => u.rol === 'TERAPEUTA' && u.id);
      }
    });
  }

  loadTerapeuta(id: number): void {
    this.terapeutaService.getTerapeuta(id).subscribe((terapeuta) => {
      this.terapeutaForm.patchValue({
        ...terapeuta,
        fechaACV: new Date(terapeuta.fechaACV).toISOString().substring(0, 10),
      });
    });
  }

  onSubmit(): void {
    if (this.terapeutaForm.valid) {
      const terapeutaData = this.terapeutaForm.value;

      if (this.isEdit) {
        const id = this.route.snapshot.params['id'];
        this.terapeutaService.updateTerapeuta(id, terapeutaData).subscribe({
          next: () => this.router.navigate(['/terapeutas']),
          error: (err) => console.error(err),
        });
      } else {
        this.terapeutaService.createTerapeuta(terapeutaData).subscribe({
          next: () => this.router.navigate(['/terapeutas']),
          error: (err) => console.error(err),
        });
      }
    }
  }
}
