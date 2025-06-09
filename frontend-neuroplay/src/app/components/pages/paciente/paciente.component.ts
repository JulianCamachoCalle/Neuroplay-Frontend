import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { PacienteService } from '../../cruds/pacientes/services/paciente.service';
import { TerapiaService } from '../../cruds/terapia/services/terapia.service';
import { ProgresoService } from '../../cruds/progreso/services/progreso.service';
import { SesionService } from '../../cruds/sesion/services/sesion.service';
import { EjercicioService } from '../../cruds/ejercicio/services/ejercicio.service';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/auth/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterLink],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css',
})
export class PacienteComponent implements OnInit {
  @ViewChild('progressChart', { static: true }) progressChartRef!: ElementRef;

  nombre: string = '';
  userRole: string | null = null;
  userId: number | null = null;
  paciente: any;
  terapias: any[] = [];
  progresos: any[] = [];
  ultimoProgreso: any;
  sesiones: any[] = [];
  ultimaSesion: any;
  proximasSesiones: any[] = [];
  ejerciciosRecomendados: any[] = [];
  chart: any;

  constructor(
    private pacienteService: PacienteService,
    private terapiaService: TerapiaService,
    private progresoService: ProgresoService,
    private sesionService: SesionService,
    private ejercicioService: EjercicioService,
    private loginService: LoginService,
    private jwtHelper: JwtHelperService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    const token = this.loginService.userToken;
    if (
      token &&
      typeof token === 'string' &&
      !this.jwtHelper.isTokenExpired(token)
    ) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.nombre = decodedToken.nombre || null;
      this.userId = decodedToken.id || null;
      this.userRole = decodedToken.rol || null;
    }

    const pacienteId = Number(this.userId);
    this.cargarDatosPaciente(pacienteId);
  }

  cargarDatosPaciente(pacienteId: number): void {
    // Datos del paciente
    this.pacienteService.getPaciente(pacienteId).subscribe((paciente) => {
      this.paciente = paciente;
    });

    // Terapias del paciente
    this.terapiaService.getByPaciente(pacienteId).subscribe((terapias) => {
      this.terapias = terapias;
      this.ejerciciosRecomendados = []; // Limpiar antes de cargar
      if (terapias && terapias.length > 0) {
        terapias.forEach((terapia: any) => {
          const idTerapia = terapia.id;
          // Cargar ejercicios recomendados por terapia
          this.ejercicioService
            .getEjerciciosByTerapia(idTerapia)
            .subscribe((ejercicios) => {
              this.ejerciciosRecomendados =
                this.ejerciciosRecomendados.concat(ejercicios);
            });
        });
      }
    });

    // Progreso del paciente
    this.progresoService
      .getProgresosByPaciente(pacienteId)
      .subscribe((progresos) => {
        this.progresos = progresos;
        if (progresos.length > 0) {
          this.ultimoProgreso = progresos[progresos.length - 1];
          this.inicializarGraficoProgreso(progresos);
        }
      });

    // Sesiones del paciente
    this.sesionService
      .getSesionesByPaciente(pacienteId)
      .subscribe((sesiones) => {
        this.sesiones = sesiones;
        if (sesiones.length > 0) {
          this.ultimaSesion = sesiones.reduce((latest, current) =>
            new Date(latest.fecha) > new Date(current.fecha) ? latest : current
          );

          // Proximas sesiones (futuras)
          const hoy = new Date();
          this.proximasSesiones = sesiones
            .filter((s) => new Date(s.fecha) >= hoy)
            .sort(
              (a, b) =>
                new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
            )
            .slice(0, 3);
        }
      });
  }

  inicializarGraficoProgreso(progresos: any[]): void {
    // Destruir gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Ordenar progresos por fecha
    const progresosOrdenados = [...progresos].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    const fechas = progresosOrdenados.map((p) =>
      new Date(p.fecha).toLocaleDateString()
    );
    const fuerza = progresosOrdenados.map((p) => p.fuerza);
    const movilidad = progresosOrdenados.map((p) => p.movilidad);
    const detalle = progresosOrdenados.map((p) => p.detalle);

    this.chart = new Chart(this.progressChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [
          {
            label: 'Fuerza',
            data: fuerza,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Movilidad',
            data: movilidad,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Coordinación',
            data: detalle,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 10,
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
      },
    });
  }
}
