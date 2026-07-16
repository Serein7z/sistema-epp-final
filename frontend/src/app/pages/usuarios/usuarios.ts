import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { ToastService } from '../../core/services/toast.service';
import { Loader } from '../../shared/components/loader/loader';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, Loader],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  cargando = true;

  usuarioEditando: Usuario | null = null;
  nuevaPassword = '';
  confirmarPassword = '';
  guardando = false;
  errorForm = '';

  constructor(private usuarioService: UsuarioService, private toast: ToastService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.listar().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toast.error('No se pudo conectar con el backend');
      },
    });
  }

  abrirCambioPassword(usuario: Usuario): void {
    this.usuarioEditando = usuario;
    this.nuevaPassword = '';
    this.confirmarPassword = '';
    this.errorForm = '';
  }

  cerrarPanel(): void {
    this.usuarioEditando = null;
  }

  guardarPassword(): void {
    if (!this.usuarioEditando) return;

    if (this.nuevaPassword.length < 4) {
      this.errorForm = 'La contraseña debe tener al menos 4 caracteres';
      return;
    }
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.errorForm = 'Las contraseñas no coinciden';
      return;
    }

    this.guardando = true;
    this.errorForm = '';
    const username = this.usuarioEditando.username;

    this.usuarioService.cambiarPassword(this.usuarioEditando.id, this.nuevaPassword).subscribe({
      next: () => {
        this.guardando = false;
        this.toast.exito(`Contraseña de ${username} actualizada`);
        this.cerrarPanel();
      },
      error: () => {
        this.guardando = false;
        this.errorForm = 'No se pudo actualizar la contraseña';
      },
    });
  }
}
