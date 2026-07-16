import { Injectable } from '@angular/core';

export type Tema = 'dark' | 'light';

const CLAVE_STORAGE = 'epp-tema';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private temaActual: Tema = 'dark';

  constructor() {
    const guardado = localStorage.getItem(CLAVE_STORAGE) as Tema | null;
    this.aplicar(guardado ?? 'dark');
  }

  obtenerTema(): Tema {
    return this.temaActual;
  }

  alternar(): void {
    this.aplicar(this.temaActual === 'dark' ? 'light' : 'dark');
  }

  private aplicar(tema: Tema): void {
    this.temaActual = tema;
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem(CLAVE_STORAGE, tema);
  }
}
