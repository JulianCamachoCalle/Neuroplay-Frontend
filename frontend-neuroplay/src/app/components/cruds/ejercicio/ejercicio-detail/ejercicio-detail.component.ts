import { Component, OnInit } from '@angular/core';
import { EjercicioService } from '../services/ejercicio.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ejercicio-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ejercicio-detail.component.html',
  styleUrl: './ejercicio-detail.component.css',
})
export class EjercicioDetailComponent implements OnInit {
  ejercicio: any;
  loading = true;

  constructor(
    private ejercicioService: EjercicioService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadEjercicio(id);
  }

  loadEjercicio(id: number): void {
    this.ejercicioService.getEjercicio(id).subscribe({
      next: (data) => {
        this.ejercicio = data;
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/ejercicios']);
      },
    });
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    // Convert YouTube URL to embed format if needed
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      url = `https://www.youtube.com/embed/${videoId}`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
