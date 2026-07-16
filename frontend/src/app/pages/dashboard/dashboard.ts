import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RECURSOS, RecursoConfig } from '../../core/models/recurso-config';
import { EppService } from '../../core/services/epp.service';
import { AuthService } from '../../core/services/auth.service';
import { EppItem } from '../../core/models/epp-item.model';
import { Loader } from '../../shared/components/loader/loader';
import { MiniChart } from '../../shared/components/mini-chart/mini-chart';

interface TarjetaResumen {
  config: RecursoConfig;
  total: number;
  enUso: number;
  danados: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Loader, MiniChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  cargando = true;
  tarjetas: TarjetaResumen[] = [];
  totalGeneral = 0;
  totalDanados = 0;
  sesion$;

  // Antes eran getters: Angular los reevaluaba en cada ciclo de detección de
  // cambios, .map() devolvía un array NUEVO cada vez (misma data, distinta
  // referencia), y eso hacía que MiniChart recibiera un ngOnChanges infinito
  // -> destruía y recreaba el gráfico sin parar, nunca llegaba a pintarse.
  // Ahora son propiedades normales: se calculan UNA vez, cuando llegan los datos.
  etiquetasChart: string[] = [];
  valoresChart: number[] = [];

  constructor(private epp: EppService, private auth: AuthService) {
    this.sesion$ = this.auth.sesionActual$;
  }

  ngOnInit(): void {
    const peticiones = RECURSOS.reduce((acc, r) => {
      acc[r.path] = this.epp.listar(r.path);
      return acc;
    }, {} as Record<string, ReturnType<EppService['listar']>>);

    forkJoin(peticiones).subscribe({
      next: resultado => {
        this.tarjetas = RECURSOS.map(config => {
          const items = (resultado[config.path] as EppItem[]) ?? [];
          return {
            config,
            total: items.length,
            enUso: items.filter(i => i.estado?.toLowerCase().includes('uso')).length,
            danados: items.filter(i => i.estado?.toLowerCase().includes('dañ') || i.estado?.toLowerCase().includes('dan')).length,
          };
        });
        this.totalGeneral = this.tarjetas.reduce((sum, t) => sum + t.total, 0);
        this.totalDanados = this.tarjetas.reduce((sum, t) => sum + t.danados, 0);
        this.etiquetasChart = this.tarjetas.map(t => t.config.titulo);
        this.valoresChart = this.tarjetas.map(t => t.total);
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }
}
