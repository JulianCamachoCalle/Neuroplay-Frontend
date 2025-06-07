import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { ProgresoService } from '../services/progreso.service';

@Component({
  selector: 'app-progreso-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardComponent],
  templateUrl: './progreso-list.component.html',
  styleUrl: './progreso-list.component.css',
})
export class ProgresoListComponent implements OnInit {
  progresos: any[] = [];
  loading = true;

  constructor(private progresoService: ProgresoService) {}

  ngOnInit(): void {
    this.loadProgresos();
  }

  loadProgresos(): void {
    this.progresoService.getProgresos().subscribe({
      next: (data) => {
        this.progresos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  deleteProgreso(id: number): void {
    if (confirm('¿Estás seguro de eliminar este registro de progreso?')) {
      this.progresoService.deleteProgreso(id).subscribe({
        next: () =>
          (this.progresos = this.progresos.filter((p) => p.id !== id)),
        error: (err) => console.error(err),
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
