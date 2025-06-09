import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TerapeutaService } from '../services/terapeuta.service';

@Component({
  selector: 'app-terapeuta-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './terapeuta-detail.component.html',
  styleUrl: './terapeuta-detail.component.css',
})
export class TerapeutaDetailComponent implements OnInit {
  terapeuta: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private terapeutaService: TerapeutaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadTerapeuta(id);
  }

  loadTerapeuta(id: number): void {
    this.terapeutaService.getTerapeuta(id).subscribe({
      next: (data) => {
        this.terapeuta = data;
        console.log(this.terapeuta);
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/terapeutas']);
      },
    });
  }

  getEdad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }
}
