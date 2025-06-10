import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TerapeutaService } from '../../cruds/terapeutas/services/terapeuta.service';
import { PacienteService } from '../../cruds/pacientes/services/paciente.service';
import { SesionService } from '../../cruds/sesion/services/sesion.service';
import { LoginService } from '../../../services/auth/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Chart, registerables } from 'chart.js';
import { TerapiaService } from '../../cruds/terapia/services/terapia.service';

@Component({
  selector: 'app-terapeuta',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterLink],
  templateUrl: './terapeuta.component.html',
  styleUrl: './terapeuta.component.css',
})
export class TerapeutaComponent implements OnInit {
  @ViewChild('progressChart', { static: true }) progressChartRef!: ElementRef;
  @ViewChild('acvChart', { static: true }) acvChartRef!: ElementRef;

  nombre: string = '';
  userRole: string | null = null;
  userId: number | null = null;
  terapeuta: any;
  pacientes: any[] = [];
  terapias: any[] = [];
  terapiasActivas: number = 0;
  terapiasCompletadas: number = 0;
  pacientesCompletados: number = 0;
  sesiones: any[] = [];
  sesionesHoy: number = 0;
  proximasSesiones: any[] = [];
  ultimaSesion: any = null;
  progresoPromedio: number = 0;
  pacientesActivos: number = 0;
  pacientesBuenProgreso: number = 0;
  pacientesProgresoLento: number = 0;
  calendarDays: any[] = [];
  progressChart: any;
  acvChart: any;

  constructor(
    private terapeutaService: TerapeutaService,
    private pacienteService: PacienteService,
    private terapiaService: TerapiaService,
    private loginService: LoginService,
    private jwtHelper: JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
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

    const terapeutaId = Number(this.userId);
    this.cargarDatosTerapeuta(terapeutaId);
  }

  cargarDatosTerapeuta(terapeutaId: number): void {
    // Datos del terapeuta
    this.terapeutaService.getTerapeuta(terapeutaId).subscribe((terapeuta) => {
      this.terapeuta = terapeuta;
    });

    // Pacientes del terapeuta
    this.pacienteService
      .getPacientesByTerapeuta(terapeutaId)
      .subscribe((pacientes) => {
        this.pacientes = pacientes;

        // Pacientes activos
        this.pacientesActivos = 0;
        if (this.pacientes && this.pacientes.length > 0) {
          this.pacientes.forEach((paciente) => {
            if (paciente.progresoTotal >= 30) {
              this.pacientesActivos++;
            }
          });
        }

        // Pacientes Completados
        this.pacientesCompletados = this.pacientes.filter(
          (p) => p.progresoTotal >= 90
        ).length;

        // Progreso promedio
        const progresos = this.pacientes.map((p) => p.progresoTotal);
        this.progresoPromedio = Math.round(
          progresos.reduce((sum, progreso) => sum + progreso, 0) /
            progresos.length
        );

        // Pacientes con Buen Progreso
        this.pacientesBuenProgreso = this.pacientes.filter(
          (p) => p.progresoTotal >= 50
        ).length;

        // Pacientes con Progreso Lento
        this.pacientesProgresoLento = this.pacientes.filter(
          (p) => p.progresoTotal < 50
        ).length;

        // Inicializar graficos
        this.inicializarGraficos();
      });

    // Terapias activas y completadas
    this.terapiaService.getByTerapeuta(terapeutaId).subscribe((terapias) => {
      this.terapias = terapias;
      this.terapiasActivas = 0;
      if (this.terapias && this.terapias.length > 0) {
        this.terapias.forEach((terapia) => {
          if (terapia.estado === 'ACTIVA') {
            this.terapiasActivas++;
          } else if (terapia.estado === 'COMPLETADA') {
            this.terapiasCompletadas++;
          }
        });
      }
    });
  }

  inicializarGraficos(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Destruir gráficos anteriores si existen
      if (this.progressChart) {
        this.progressChart.destroy();
      }
      if (this.acvChart) {
        this.acvChart.destroy();
      }

      // Gráfico de progreso promedio por mes
      const meses = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ];
      const progresoMensual = Array(12).fill(0);
      const conteoMensual = Array(12).fill(0);

      this.pacientes.forEach((paciente) => {
        const fecha = new Date(paciente.fechaRegistro);
        const mes = fecha.getMonth();
        progresoMensual[mes] += paciente.progresoTotal;
        conteoMensual[mes]++;
      });

      const promedioMensual = progresoMensual.map((total, i) =>
        conteoMensual[i] > 0 ? Math.round(total / conteoMensual[i]) : 0
      );

      this.progressChart = new Chart(this.progressChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Progreso promedio',
              data: promedioMensual,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
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

      // Gráfico de distribución por tipo de ACV
      const tiposACV = ['ISQUÉMICO', 'HEMORRÁGICO', 'TIA', 'OTRO'];
      const conteoACV = tiposACV.map(
        (tipo) => this.pacientes.filter((p) => p.tipoAcv === tipo).length
      );

      this.acvChart = new Chart(this.acvChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: tiposACV,
          datasets: [
            {
              data: conteoACV,
              backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            },
          },
        },
      });
    }
  }

  // Helper methods
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

  getEstadoPaciente(progreso: number): string {
    if (progreso >= 70) return 'Avanzado';
    if (progreso >= 30) return 'Intermedio';
    return 'Inicial';
  }
}
