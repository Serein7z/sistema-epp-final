import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RECURSOS } from '../models/recurso-config';
import { EppService } from './epp.service';

// Este servicio es la pieza clave de "comunicación entre componentes" vía servicio:
// Sidebar se suscribe a conteos$ y RecursoList llama a refrescar() después de
// crear/editar/eliminar. Ningún componente le habla directo al otro; ambos
// reaccionan al mismo BehaviorSubject.
@Injectable({ providedIn: 'root' })
export class ContadorService {
  private conteos$ = new BehaviorSubject<Record<string, number>>(
    Object.fromEntries(RECURSOS.map(r => [r.path, 0]))
  );
  conteosActuales$ = this.conteos$.asObservable();

  constructor(private epp: EppService) {
    RECURSOS.forEach(r => this.refrescar(r.path));
  }

  refrescar(path: string): void {
    this.epp.listar(path).subscribe({
      next: items => {
        const actual = this.conteos$.value;
        this.conteos$.next({ ...actual, [path]: items.length });
      },
      error: () => {
        const actual = this.conteos$.value;
        this.conteos$.next({ ...actual, [path]: 0 });
      },
    });
  }
}
