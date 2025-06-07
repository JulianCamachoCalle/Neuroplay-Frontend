import { Component, OnInit } from '@angular/core';
import { ProgresoService } from '../services/progreso.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../pacientes/services/paciente.service';

@Component({
  selector: 'app-progreso-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './progreso-detail.component.html',
  styleUrl: './progreso-detail.component.css',
})
export class ProgresoDetailComponent implements OnInit {
  progreso: any = {
    pacienteId: null,
    nombrePaciente: 'Cargando...',
    fecha: new Date().toISOString(),
    fuerza: 0,
    movilidad: 0,
    detalle: 0,
    notas: '',
  };
  loading = true;

  constructor(
    private progresoService: ProgresoService,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadProgreso(id);
  }

  loadProgreso(id: number): void {
    this.progresoService.getProgreso(id).subscribe({
      next: (data) => {
        this.progreso = data;
        this.loadPaciente();
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/progresos']);
      },
    });
  }

  loadPaciente(): void {
    if (this.progreso.pacienteId) {
      this.pacienteService.getPaciente(this.progreso.pacienteId).subscribe({
        next: (paciente) => {
          this.progreso.nombrePaciente = paciente?.usuario?.nombre
            ? `${paciente.usuario.nombre} ${paciente.usuario.apellido || ''}`
            : 'Paciente no encontrado';
        },
        error: () => {
          this.progreso.nombrePaciente = 'Error al cargar paciente';
        },
      });
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  }

  getProgressColor(value: number): string {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }
}
