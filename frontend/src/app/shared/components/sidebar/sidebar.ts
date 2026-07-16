import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RECURSOS } from '../../../core/models/recurso-config';
import { AuthService } from '../../../core/services/auth.service';
import { ContadorService } from '../../../core/services/contador.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  recursos = RECURSOS;
  // Viene de un servicio con BehaviorSubject: se actualiza solo cuando cualquier
  // módulo crea, edita o elimina un registro, sin recargar la página.
  conteos$;
  sesion$;
  esAdmin = false;

  constructor(
    private auth: AuthService,
    private contador: ContadorService,
    private router: Router,
    private theme: ThemeService,
    private toast: ToastService
  ) {
    this.sesion$ = this.auth.sesionActual$;
    this.conteos$ = this.contador.conteosActuales$;
  }

  get temaOscuro(): boolean {
    return this.theme.obtenerTema() === 'dark';
  }

  alternarTema(): void {
    this.theme.alternar();
  }

  ngOnInit(): void {
    this.esAdmin = this.auth.esAdmin();
  }

  cerrarSesion(): void {
    const username = this.auth.sesionActual?.username;
    this.auth.logout();
    this.toast.info(`Hasta luego, ${username ?? 'usuario'}`);
    this.router.navigate(['/login']);
  }
}
