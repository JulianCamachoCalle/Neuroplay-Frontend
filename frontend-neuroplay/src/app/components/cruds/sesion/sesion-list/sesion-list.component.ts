import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-sesion-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardComponent],
  templateUrl: './sesion-list.component.html',
  styleUrl: './sesion-list.component.css',
})
export class SesionListComponent implements OnInit {
  sesiones: any[] = [];
  loading = true;

  constructor(private sesionService: SesionService) {}

  ngOnInit(): void {
    this.loadSesiones();
  }

  loadSesiones(): void {
    this.sesionService.getSesiones().subscribe({
      next: (data) => {
        this.sesiones = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  deleteSesion(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta sesión?')) {
      this.sesionService.deleteSesion(id).subscribe({
        next: () => (this.sesiones = this.sesiones.filter((s) => s.id !== id)),
        error: (err) => console.error(err),
      });
    }
  }

  toggleCompletada(sesion: any): void {
    this.sesionService.marcarCompletada(sesion.id).subscribe({
      next: () => {
        sesion.completada = !sesion.completada;
      },
      error: (err) => console.error(err),
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
}
