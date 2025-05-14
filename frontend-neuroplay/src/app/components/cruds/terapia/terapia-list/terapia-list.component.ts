import { Component, OnInit } from '@angular/core';
import { TerapiaService } from '../services/terapia.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardComponent } from '../../../dashboard/dashboard.component';

@Component({
  selector: 'app-terapia-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardComponent],
  templateUrl: './terapia-list.component.html',
  styleUrl: './terapia-list.component.css',
})
export class TerapiaListComponent implements OnInit {
  terapias: any[] = [];
  loading = true;

  constructor(private terapiaService: TerapiaService) {}

  ngOnInit(): void {
    this.loadTerapias();
  }

  loadTerapias(): void {
    this.terapiaService.getTerapias().subscribe({
      next: (data) => {
        this.terapias = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  deleteTerapia(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta terapia?')) {
      this.terapiaService.deleteTerapia(id).subscribe({
        next: () => (this.terapias = this.terapias.filter((t) => t.id !== id)),
        error: (err) => console.error(err),
      });
    }
  }
}
