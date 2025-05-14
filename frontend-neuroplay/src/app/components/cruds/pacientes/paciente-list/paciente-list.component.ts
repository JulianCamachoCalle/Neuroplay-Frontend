import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../services/paciente.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardComponent } from '../../../dashboard/dashboard.component';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardComponent],
  templateUrl: './paciente-list.component.html',
  styleUrl: './paciente-list.component.css',
})
export class PacienteListComponent implements OnInit {
  pacientes: any[] = [];
  loading = true;

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  deletePaciente(id: number): void {
    if (confirm('¿Estás seguro de eliminar este paciente?')) {
      this.pacienteService.deletePaciente(id).subscribe({
        next: () =>
          (this.pacientes = this.pacientes.filter((p) => p.id !== id)),
        error: (err) => console.error(err),
      });
    }
  }
}
