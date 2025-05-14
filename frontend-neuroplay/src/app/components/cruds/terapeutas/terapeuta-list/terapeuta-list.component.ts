import { Component } from '@angular/core';
import { TerapeutaService } from '../services/terapeuta.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardComponent } from '../../../dashboard/dashboard.component';

@Component({
  selector: 'app-terapeuta-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardComponent],
  templateUrl: './terapeuta-list.component.html',
  styleUrl: './terapeuta-list.component.css',
})
export class TerapeutaListComponent {
  terapeutas: any[] = [];
  loading = true;

  constructor(private terapeutaService: TerapeutaService) {}

  ngOnInit(): void {
    this.loadTerapeutas();
  }

  loadTerapeutas(): void {
    this.terapeutaService.getTerapeutas().subscribe({
      next: (data) => {
        this.terapeutas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  deleteTerapeuta(id: number): void {
    if (confirm('¿Estás seguro de eliminar este terapeuta?')) {
      this.terapeutaService.deleteTerapeuta(id).subscribe({
        next: () =>
          (this.terapeutas = this.terapeutas.filter((p) => p.id !== id)),
        error: (err) => console.error(err),
      });
    }
  }
}
