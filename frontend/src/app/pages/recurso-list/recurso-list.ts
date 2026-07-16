import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { obtenerRecurso, RecursoConfig } from '../../core/models/recurso-config';
import { EppItem, ESTADOS_EPP } from '../../core/models/epp-item.model';
import { EppService } from '../../core/services/epp.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { ContadorService } from '../../core/services/contador.service';
import { Loader } from '../../shared/components/loader/loader';
import { RecursoForm } from '../recurso-form/recurso-form';
import { EstadoClasePipe } from '../../shared/pipes/estado-clase.pipe';
import { CapitalizarPipe } from '../../shared/pipes/capitalizar.pipe';
import { BuscarPipe } from '../../shared/pipes/buscar.pipe';
import { MiniChart } from '../../shared/components/mini-chart/mini-chart';

@Component({
  selector: 'app-recurso-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Loader, RecursoForm, EstadoClasePipe, CapitalizarPipe, MiniChart],
  templateUrl: './recurso-list.html',
  styleUrl: './recurso-list.scss',
})
export class RecursoList implements OnInit {
  config!: RecursoConfig;
  items: EppItem[] = [];
  cargando = true;
  termino = '';

  // Filtro por estado + paginación
  estadosDisponibles = ESTADOS_EPP;
  filtroEstado = 'todos';
  paginaActual = 1;
  tamanoPagina = 5;

  panelAbierto = false;
  itemEditando: EppItem | null = null;
  itemAEliminar: EppItem | null = null;

  esAdmin = false;

  // El pipe de búsqueda se usa de forma programática aquí (no en el template)
  // porque la paginación necesita saber cuántos resultados quedaron DESPUÉS
  // de filtrar, para poder calcular el total de páginas correctamente.
  private buscarPipe = new BuscarPipe();

  constructor(
    private route: ActivatedRoute,
    private epp: EppService,
    private toast: ToastService,
    private auth: AuthService,
    private contador: ContadorService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.auth.esAdmin();
    // La ruta trae el tipo de recurso como parámetro (:tipo); al cambiar de módulo
    // en el sidebar, este mismo componente se reutiliza y vuelve a cargar.
    this.route.paramMap.subscribe(params => {
      const tipo = params.get('tipo')!;
      const config = obtenerRecurso(tipo);
      if (!config) return;
      this.config = config;
      this.termino = '';
      this.filtroEstado = 'todos';
      this.paginaActual = 1;
      this.cargarLista();
    });
  }

  get clavesBusqueda(): string[] {
    return ['estado', 'observacion', ...this.config.campos.map(c => c.key)];
  }

  get itemsFiltrados(): EppItem[] {
    const porTexto = this.buscarPipe.transform(this.items, this.termino, this.clavesBusqueda);
    if (this.filtroEstado === 'todos') return porTexto;
    return porTexto.filter(i => i.estado === this.filtroEstado);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.itemsFiltrados.length / this.tamanoPagina));
  }

  get itemsPaginados(): EppItem[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.itemsFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get rangoPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  // Antes eran getters -> Angular los reevaluaba en cada ciclo de detección
  // de cambios, devolviendo un array nuevo cada vez aunque los datos fueran
  // los mismos. Eso disparaba ngOnChanges en MiniChart sin parar (destruía y
  // recreaba el gráfico en bucle, nunca llegaba a pintarse). Ahora son
  // propiedades normales, recalculadas solo cuando this.items realmente cambia.
  etiquetasEstado: string[] = [];
  valoresEstado: number[] = [];

  private recalcularDistribucionEstado(): void {
    this.etiquetasEstado = [...new Set(this.items.map(i => i.estado))];
    this.valoresEstado = this.etiquetasEstado.map(
      estado => this.items.filter(i => i.estado === estado).length
    );
  }

  onFiltroCambiado(): void {
    this.paginaActual = 1;
  }

  irAPagina(n: number): void {
    if (n < 1 || n > this.totalPaginas) return;
    this.paginaActual = n;
  }

  cargarLista(): void {
    this.cargando = true;
    this.epp.listar(this.config.path).subscribe({
      next: items => {
        this.items = items;
        this.recalcularDistribucionEstado();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toast.error('No se pudo conectar con el backend');
      },
    });
  }

  abrirNuevo(): void {
    this.itemEditando = null;
    this.panelAbierto = true;
  }

  abrirEdicion(item: EppItem): void {
    this.itemEditando = item;
    this.panelAbierto = true;
  }

  onGuardado(item: EppItem): void {
    this.panelAbierto = false;
    this.cargarLista();
    this.contador.refrescar(this.config.path);
  }

  onCerradoPanel(): void {
    this.panelAbierto = false;
  }

  pedirConfirmacion(item: EppItem): void {
    this.itemAEliminar = item;
  }

  cancelarEliminacion(): void {
    this.itemAEliminar = null;
  }

  confirmarEliminacion(): void {
    if (!this.itemAEliminar?.id) return;
    const id = this.itemAEliminar.id;
    this.epp.eliminar(this.config.path, id).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== id);
        this.recalcularDistribucionEstado();
        this.toast.exito(`${this.config.singular} eliminado`);
        this.itemAEliminar = null;
        this.contador.refrescar(this.config.path);
        if (this.paginaActual > this.totalPaginas) {
          this.paginaActual = this.totalPaginas;
        }
      },
      error: () => {
        this.toast.error('No se pudo eliminar el registro');
        this.itemAEliminar = null;
      },
    });
  }
}
