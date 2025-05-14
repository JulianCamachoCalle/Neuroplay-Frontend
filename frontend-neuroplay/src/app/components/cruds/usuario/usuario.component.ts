import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuarios: any[] = [];

  ngOnInit(): void {
    this.usuarioService.listAll().subscribe((usuarios: any) => {
      this.usuarios = usuarios;
      console.log(this.usuarios);
    });
  }

  loadAll() {
    this.usuarioService.listAll().subscribe((usuarios: any) => {
      this.usuarios = usuarios;
    });
  }

  deleteUsuario(usuario: Usuario) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al usuario "${usuario.nombre} ${usuario.apellido}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(usuario.id).subscribe({
          next: () => {
            this.loadAll(); // Recarga la lista de usuarios
            Swal.fire(
              '¡Eliminado!',
              `El Usuario "${usuario.nombre} ${usuario.apellido}" ha sido eliminado.`,
              'success'
            );
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            this.loadAll(); // Recarga la lista de usuarios
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar al usuario. Inténtalo nuevamente.',
              'error'
            );
          },
        });
      }
    });
  }
}
