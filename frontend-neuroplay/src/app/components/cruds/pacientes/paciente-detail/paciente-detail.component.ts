import { Component, OnInit } from '@angular/core';
import { TerapiaService } from '../../terapia/services/terapia.service';
import { PacienteService } from '../services/paciente.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './paciente-detail.component.html',
  styleUrl: './paciente-detail.component.css',
})
export class PacienteDetailComponent implements OnInit {
  paciente: any;
  terapias: any[] = [];
  loading = true;

  constructor(
    private pacienteService: PacienteService,
    private terapiaService: TerapiaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadPaciente(id);
    this.loadTerapias(id);
  }

  loadPaciente(id: number): void {
    this.pacienteService.getPaciente(id).subscribe({
      next: (data) => {
        this.paciente = data;
        console.log(this.paciente);
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/pacientes']);
      },
    });
  }

  loadTerapias(pacienteId: number): void {
    this.terapiaService.getByPaciente(pacienteId).subscribe({
      next: (data) => {
        this.terapias = data;
      },
      error: (err) => console.error(err),
    });
  }

  getEdad(fechaNacimiento: string): number {
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}
