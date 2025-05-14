import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  usuario: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      this.usuarioService.getById(+userId).subscribe({
        next: (data) => {
          this.usuario = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar perfil', err);
          this.isLoading = false;
        },
      });
    }
  }
}
