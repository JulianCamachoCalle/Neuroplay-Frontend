import { Component, OnInit } from '@angular/core';
import { EjercicioService } from '../services/ejercicio.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardComponent } from '../../../dashboard/dashboard.component';

@Component({
  selector: 'app-ejercicio-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardComponent],
  templateUrl: './ejercicio-list.component.html',
  styleUrl: './ejercicio-list.component.css',
})
export class EjercicioListComponent implements OnInit {
  ejercicios: any[] = [];
  loading = true;

  constructor(private ejercicioService: EjercicioService) {}

  ngOnInit(): void {
    this.loadEjercicios();
  }

  loadEjercicios(): void {
    this.ejercicioService.getEjercicios().subscribe({
      next: (data) => {
        this.ejercicios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  deleteEjercicio(id: number): void {
    if (confirm('¿Estás seguro de eliminar este ejercicio?')) {
      this.ejercicioService.deleteEjercicio(id).subscribe({
        next: () =>
          (this.ejercicios = this.ejercicios.filter((e) => e.id !== id)),
        error: (err) => console.error(err),
      });
    }
  }
}
