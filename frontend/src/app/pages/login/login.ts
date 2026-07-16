import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  cargando = false;
  saliendo = false;
  errorLogin = '';
  mostrarPassword = false;

  blobs = Array.from({ length: 14 }, (_, i) => ({
    top: `${(i * 37) % 100}%`,
    left: `${(i * 53) % 100}%`,
  }));

  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private theme: ThemeService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      recordar: [false],
    });
  }

  get temaOscuro(): boolean {
    return this.theme.obtenerTema() === 'dark';
  }

  alternarTema(): void {
    this.theme.alternar();
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.errorLogin = '';
    const { username, password } = this.form.value;

    this.auth.login(username!, password!).subscribe({
      next: () => {
        this.toast.exito(`Bienvenido, ${username}`);
        this.saliendo = true;
        setTimeout(() => this.router.navigate(['/dashboard']), 1800);
      },
      error: () => {
        this.cargando = false;
        this.errorLogin = 'Usuario o contraseña incorrectos';
      },
    });
  }
}
