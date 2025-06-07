import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SesionService } from '../services/sesion.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EjercicioService } from '../../ejercicio/services/ejercicio.service';
import { PacienteService } from '../../pacientes/services/paciente.service';

@Component({
  selector: 'app-sesion-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sesion-detail.component.html',
  styleUrl: './sesion-detail.component.css',
})
export class SesionDetailComponent implements OnInit {
  sesion: any;
  loading = true;

  constructor(
    private sesionService: SesionService,
    private ejercicioService: EjercicioService,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadSesion(id);
  }

  loadSesion(id: number): void {
    this.sesionService.getSesion(id).subscribe({
      next: (data) => {
        this.sesion = data;

        // Inicializa paciente y ejercicio como objetos vacíos
        this.sesion.paciente = this.sesion.paciente || { usuario: {} };
        this.sesion.ejercicio = this.sesion.ejercicio || {};

        this.loadEjercicio();
        this.loadPaciente();
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/sesiones']);
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  loadEjercicio(): void {
    if (this.sesion?.ejercicioId) {
      this.ejercicioService.getEjercicio(this.sesion.ejercicioId).subscribe({
        next: (data) => {
          this.sesion.ejercicio = data || { nombre: 'Ejercicio no disponible' };
        },
        error: (err) => {
          console.error(err);
          this.sesion.ejercicio = { nombre: 'Error al cargar ejercicio' };
        },
      });
    } else {
      this.sesion.ejercicio = { nombre: 'Sin ejercicio asignado' };
    }
  }

  loadPaciente(): void {
    if (this.sesion?.pacienteId) {
      this.pacienteService.getPaciente(this.sesion.pacienteId).subscribe({
        next: (data) => {
          this.sesion.paciente = data || {
            usuario: { nombre: 'Paciente no disponible' },
          };
        },
        error: (err) => {
          console.error(err);
          this.sesion.paciente = {
            usuario: { nombre: 'Error al cargar paciente' },
          };
        },
      });
    } else {
      this.sesion.paciente = { usuario: { nombre: 'Sin paciente asignado' } };
    }
  }

  getRendimientoColor(rendimiento: string): string {
    switch (rendimiento) {
      case 'EXCELENTE':
        return 'bg-green-100 text-green-800';
      case 'BUENO':
        return 'bg-blue-100 text-blue-800';
      case 'REGULAR':
        return 'bg-yellow-100 text-yellow-800';
      case 'MALO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  toggleCompletada(): void {
    this.sesionService.marcarCompletada(this.sesion.id).subscribe({
      next: () => {
        this.sesion.completada = !this.sesion.completada;
      },
      error: (err) => console.error(err),
    });
  }
}
