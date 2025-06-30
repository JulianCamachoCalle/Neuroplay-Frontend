import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Terapia } from '../../cruds/terapia/models/terapia';
import { Ejercicio } from '../../cruds/ejercicio/models/ejercicio';
import { TerapiaService } from '../../cruds/terapia/services/terapia.service';
import { EjercicioService } from '../../cruds/ejercicio/services/ejercicio.service';
import { NavbarComponent } from "../../navbar/navbar.component";
import { ProgresoService } from '../../cruds/progreso/services/progreso.service';
import { PacienteService } from '../../cruds/pacientes/services/paciente.service';
import { Paciente } from '../../cruds/pacientes/models/paciente';
import { LoginService } from '../../../services/auth/login.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-proceso-terapia',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './proceso-terapia.component.html',
  styleUrls: ['./proceso-terapia.component.css']
})
export class ProcesoTerapiaComponent implements OnInit, OnDestroy {
  terapiaId: number = 0;
  terapia: Terapia | null = null;
  ejercicios: Ejercicio[] = [];
  ejercicioActual: Ejercicio | null = null;
  ejercicioIndex: number = 0;
  progresoSesion: number = 0;
  progresoTotal: number = 0;
  repeticionesCompletadas: number = 0;
  tiempoRestante: number = 0;
  intervalo: any;
  terapiaCompletada: boolean = false;
  progresoGuardado: boolean = false;
  paciente: Paciente | null = null;
  videoUrl: SafeResourceUrl | null = null;
  private videoUrlCache = '';

  constructor(
    private terapiaService: TerapiaService,
    private ejercicioService: EjercicioService,
    private progresoService: ProgresoService,
    private pacienteService: PacienteService,
    private authService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.terapiaId = +params['id'];
      this.cargarDatosIniciales();
    });
  }

  cargarDatosIniciales(): void {
    // Cargar datos del paciente
    this.authService.getUsuarioActual().subscribe(usuario => {
      if (usuario?.id) {
        this.pacienteService.getPacienteByUsuario(usuario.id).subscribe(paciente => {
          this.paciente = paciente;
          this.progresoTotal = paciente.progresoTotal || 0;

          // Cargar terapia y ejercicios
          this.cargarTerapia();
          this.cargarEjercicios();
        });
      }
    });
  }

  cargarTerapia(): void {
    this.terapiaService.getTerapia(this.terapiaId).subscribe({
      next: (terapia) => {
        this.terapia = terapia;
      },
      error: (err) => {
        console.error('Error al cargar terapia:', err);
      }
    });
  }

  cargarEjercicios(): void {
    this.ejercicioService.getEjerciciosByTerapia(this.terapiaId).subscribe({
      next: (ejercicios) => {
        this.ejercicios = ejercicios;
        if (ejercicios.length > 0) {
          // Buscar el último ejercicio no completado
          const ejercicioIndex = Math.floor(this.progresoSesion / (100 / ejercicios.length));
          this.iniciarEjercicio(ejercicioIndex);
        }
      },
      error: (err) => {
        console.error('Error al cargar ejercicios:', err);
      }
    });
  }

  iniciarEjercicio(index: number): void {
    this.ejercicioIndex = index;
    this.ejercicioActual = this.ejercicios[index];
    this.repeticionesCompletadas = 0;

    // Actualiza la URL del video solo si ha cambiado
    if (this.ejercicioActual.videoUrl && this.ejercicioActual.videoUrl !== this.videoUrlCache) {
      this.videoUrlCache = this.ejercicioActual.videoUrl;
      this.videoUrl = this.getSafeVideoUrl(this.ejercicioActual.videoUrl);
    }

    if (this.ejercicioActual.duracionMinutos > 0) {
      this.tiempoRestante = this.ejercicioActual.duracionMinutos * 60;
      this.iniciarTemporizador();
    }

    this.actualizarProgresoSesion();
  }

  iniciarTemporizador(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }

    this.intervalo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        clearInterval(this.intervalo);
        // Avanzar automáticamente si es ejercicio de tiempo
        this.siguienteEjercicio();
      }
    }, 1000);
  }

  completarRepeticion(): void {
    if (this.ejercicioActual) {
      this.repeticionesCompletadas++;
      this.actualizarProgresoSesion();

      if (this.repeticionesCompletadas >= this.ejercicioActual.repeticiones) {
        this.siguienteEjercicio();
      } else {
        // Guardar progreso parcial cada 2 repeticiones
        if (this.repeticionesCompletadas % 2 === 0) {
          this.guardarProgreso();
        }
      }
    }
  }

  siguienteEjercicio(): void {
    clearInterval(this.intervalo);

    if (this.ejercicioIndex < this.ejercicios.length - 1) {
      this.iniciarEjercicio(this.ejercicioIndex + 1);
    } else {
      this.completarTerapia();
    }

    this.guardarProgreso();
  }

  actualizarProgresoSesion(): void {
    if (!this.ejercicioActual) return;

    // Calcular progreso dentro del ejercicio actual
    const progresoEjercicio = this.ejercicioActual.repeticiones > 0
      ? this.repeticionesCompletadas / this.ejercicioActual.repeticiones
      : 1;

    // Calcular progreso general de la sesión
    const progresoPorEjercicio = 100 / this.ejercicios.length;
    const progresoAnterior = this.ejercicioIndex * progresoPorEjercicio;
    const progresoActual = progresoEjercicio * progresoPorEjercicio;

    this.progresoSesion = Math.min(100, progresoAnterior + progresoActual);
  }

  completarTerapia(): void {
    this.terapiaCompletada = true;
    this.progresoSesion = 100;

    // Actualizar progreso total del paciente
    if (this.paciente) {
      const nuevoProgresoTotal = Math.min(100, this.paciente.progresoTotal + (100 / this.ejercicios.length));

      this.pacienteService.actualizarProgresoPaciente(
        this.paciente.id,
        nuevoProgresoTotal,
        (this.paciente.ejerciciosCompletados || 0) + this.ejercicios.length,
        (this.paciente.diasConsecutivos || 0) + 1
      ).subscribe({
        next: (pacienteActualizado) => {
          this.paciente = pacienteActualizado;
          this.progresoTotal = pacienteActualizado.progresoTotal;
          this.guardarProgreso();
        },
        error: (err) => {
          console.error('Error al actualizar progreso del paciente:', err);
        }
      });
    }
  }

  guardarProgreso(): void {
    if (this.progresoGuardado || !this.paciente) return;

    // Guardar progreso específico de la terapia
    this.progresoService.guardarProgresoTerapia(
      this.terapiaId,
      this.paciente.id,
    ).subscribe({
      next: () => {
        this.progresoGuardado = true;
        console.log('Progreso guardado correctamente');
      },
      error: (err) => {
        console.error('Error al guardar progreso:', err);
      }
    });
  }

  salirDeTerapia(): void {
    this.guardarProgreso();
    this.router.navigate(['/paciente']);
  }

  formatearTiempo(segundos: number): string {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }

    // Guardar progreso al salir si no está completado
    if (!this.terapiaCompletada && this.progresoSesion > 0 && this.paciente) {
      this.guardarProgreso();

      // Actualizar progreso total parcial si hay avance
      if (this.progresoSesion > 0) {
        const incremento = (this.progresoSesion / 100) * (100 / this.ejercicios.length);
        const nuevoProgresoTotal = Math.min(100, (this.paciente.progresoTotal || 0) + incremento);

        this.pacienteService.actualizarProgresoPaciente(
          this.paciente.id,
          nuevoProgresoTotal
        ).subscribe();
      }
    }
  }

  finalizarTerapia(): void {
    this.router.navigate(['/paciente']);
  }


  private getSafeVideoUrl(url: string): SafeResourceUrl {
    // Para YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

}