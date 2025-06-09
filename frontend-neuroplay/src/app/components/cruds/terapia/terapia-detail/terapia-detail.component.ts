import { Component, OnInit } from '@angular/core';
import { TerapiaService } from '../services/terapia.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EjercicioService } from '../../ejercicio/services/ejercicio.service';

@Component({
  selector: 'app-terapia-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './terapia-detail.component.html',
  styleUrl: './terapia-detail.component.css',
})
export class TerapiaDetailComponent implements OnInit {
  terapia: any;
  loading = true;
  ejercicios: any[] = [];

  constructor(
    private terapiaService: TerapiaService,
    private ejercicioService: EjercicioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadTerapia(id);
    this.loadEjercicios(id);
  }

  loadTerapia(id: number): void {
    this.terapiaService.getTerapia(id).subscribe({
      next: (data) => {
        this.terapia = data;
        console.log(this.terapia);
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/terapias']);
      },
    });
  }

  loadEjercicios(id: number): void {
    this.ejercicioService.getEjerciciosByTerapia(id).subscribe({
      next: (data) => {
        this.ejercicios = data;
      },
      error: (err) => console.error(err),
    });
  }

  cambiarEstado(nuevoEstado: string): void {
    if (confirm(`¿Cambiar estado a ${nuevoEstado}?`)) {
      this.terapiaService
        .cambiarEstado(this.terapia.id, nuevoEstado)
        .subscribe({
          next: () => {
            this.terapia.estado = nuevoEstado;
          },
          error: (err) => console.error(err),
        });
    }
  }
}
